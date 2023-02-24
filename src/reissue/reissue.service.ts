import axios from 'axios';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserSessionDto } from '../auth/dto/user.session.dto';
import { IUserCardRepository } from './repository/interface/user-card-no.repository.interface';
import { GoogleSpreadSheetApi } from './googleAuth.component';
import { reissueSateDto } from './dto/reissueState.dto';
import { reissueRequestDto } from './dto/reissueRequest.dto';
import { reissueFinishedDto } from './dto/reissueFinished.dto';

@Injectable()
export class ReissueService {
  constructor(
    private gsApi: GoogleSpreadSheetApi,
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject('IUserCardRepository')
    private UserCardRepository: IUserCardRepository,
  ) {}
  private logger = new Logger(ReissueService.name);
  private gs = this.gsApi.getGoogleSheetInstance();
  private jandiWebhook = this.configService.get<string>('jandi.webhook');

  getTimeNowKST(): string {
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const requestedAt = new Date(Date.now() + KR_TIME_DIFF)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    return requestedAt;
  }
  /**
   * 사용자의 출입카드 재신청에 대한 상태를 string으로 반환합니다.
   * 상태는 총 3단계 (in_progress, pick up requested, done)
   * in_progress: 재발급 신청 후 제작 중
   * pick_up_requested: 인포에서 재발급 카드 권한 부여를 마친 경우
   * picked_up: 학생이 인포에서 수령 완료한 경우
   * @param user_id number
   * @returns 출입카드 재신청 상태 reissueSateDto
   */
  async getReissueState(user_id: number): Promise<reissueSateDto> {
    this.logger.debug(
      `@getReissueState) reissue state requested from user_id: ${user_id}`,
    );
    const result = await this.gsApi.getAllValues();
    const filtered = [];
    for (const row of result) {
      if (row[0] == user_id) {
        filtered.push(row);
      }
    }
    if (!filtered.length) {
      throw new NotFoundException('신청내역 없음');
    }
    const recent = filtered.pop();
    const isIssued = recent[3];
    const isPickedUp = recent[4];
    let state = '';
    if (isIssued) {
      if (isPickedUp) {
        state = 'done';
      } else {
        state = 'pick up requested';
      }
    } else {
      state = 'in_progress';
    }
    return { state: state };
  }

  /**
   * @param user 사용자
   */
  async reissueRequest(user: UserSessionDto): Promise<reissueRequestDto> {
    this.logger.debug(
      `@reissueRequest) ${user.login} requested for card reissuance.`,
    );
    const requestedAt = this.getTimeNowKST();
    const initialCardNo = (
      await this.UserCardRepository.findInitialCardByUserId(user.user_id)
    ).pop();

    if (!initialCardNo) {
      throw new NotFoundException('기존 카드번호 없음');
    }

    const data = [user.user_id, user.login, requestedAt, '', '', initialCardNo];
    try {
      (await this.gs).spreadsheets.values.append({
        spreadsheetId: this.gsApi.gsId,
        auth: this.gsApi.auth,
        range: this.gsApi.gsRange,
        valueInputOption: 'RAW',
        requestBody: {
          values: [data],
        },
      });
    } catch (error) {
      this.logger.error(
        `@reissueRequest) failed to request for new card issuance for ${user.login}: ${error.message}`,
      );
      throw new ServiceUnavailableException(
        `카드 재발급 신청 구글스프레드 시트에 업데이트 실패: ${error.message}`,
      );
    }
    try {
      const jandiData = {
        login: user.login,
        initial_card_no: initialCardNo,
        requested_at: requestedAt,
      };
      await axios.post(this.jandiWebhook, jandiData);
      this.logger.debug(
        `@reissueRequest) send jandi alarm for ${user.login}'s card reissuance request`,
      );
    } catch (error) {
      this.logger.error(
        `@reissueRequest) failed to alarm jandi for new card issuance for ${user.login}: ${error.message}`,
      );
      throw new ServiceUnavailableException(
        `카드 재발급 신청 잔디알림 실패: ${error.message}`,
      );
    }
    return {
      login: user.login,
      requested_at: requestedAt,
    };
  }
  /**
   * 최신 재발급 신청내역에 대하여 구글스프레드 시트 수령완료 행 업데이트
   * @param user 사용자
   */
  async patchReissueState(user: UserSessionDto): Promise<reissueFinishedDto> {
    this.logger.debug(
      `@patchReissueState) ${user.login} requested for card reissuance.`,
    );
    const result = await this.gsApi.getAllValues();
    const filtered = [];
    result.forEach((row, index) => {
      if (row[0] == user.user_id) {
        filtered.push({ index: index, row: row });
      }
    });
    if (!filtered.length) {
      throw new NotFoundException('신청내역 없음');
    }
    const recent = filtered.pop();
    const rowNum = recent['index'] + 1;
    (await this.gs).spreadsheets.values.update({
      spreadsheetId: this.gsApi.gsId,
      range: this.gsApi.gsRange + `!E${rowNum}`,
      requestBody: {
        values: [['O']],
      },
      valueInputOption: 'USER_ENTERED',
    });
    const initialCardNo = recent['row'][5];
    const newCardNo = recent['row'][6];
    const pickedUpAt = this.getTimeNowKST();
    try {
      const jandiData = {
        login: user.login,
        initial_card_no: initialCardNo,
        new_card_no: newCardNo,
        picked_up_at: pickedUpAt,
      };
      await axios.post(this.jandiWebhook, jandiData);
      this.logger.debug(
        `@reissueRequest) send jandi alarm for ${user.login}'s card reissuance request`,
      );
    } catch (error) {
      this.logger.error(
        `@reissueRequest) failed to alarm jandi for new card issuance for ${user.login}: ${error.message}`,
      );
      throw new ServiceUnavailableException(
        `재발급 카드 수령완료 잔디알림 실패: ${error.message}`,
      );
    }
    return {
      login: user.login,
      picked_up_at: pickedUpAt,
    };
  }
}
