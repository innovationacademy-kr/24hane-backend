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

@Injectable()
export class ReissueService {
  public logger = new Logger(ReissueService.name);

  constructor(
    private gsApi: GoogleSpreadSheetApi,
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject('IUserCardRepository')
    private UserCardRepository: IUserCardRepository,
  ) {}

  private jandiWebhook = this.configService.get<string>('jandi.webhook');
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
    const gs = await this.gsApi.getGoogleSheetInstance();
    const allCardReissues = await gs.spreadsheets.values.get({
      auth: this.gsApi.auth,
      spreadsheetId: this.gsApi.gsId,
      range: this.gsApi.gsRange,
    });

    const result = allCardReissues.data.values;
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
   * 출입카드 재신청
   * 구글 스프레드시트에 user_id, 인트라, 신청 날짜/시간, 기존 카드번호 row 추가
   * @param user 사용자
   */
  async reissueRequest(user: UserSessionDto): Promise<reissueRequestDto> {
    this.logger.debug(
      `@reissueRequest) ${user.login} requested for card reissuance.`,
    );
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const requestedAt = new Date(Date.now() + KR_TIME_DIFF)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    const initialCardNo = (
      await this.UserCardRepository.findInitialCardByUserId(user.user_id)
    ).pop();

    if (!initialCardNo) {
      throw new NotFoundException('기존 카드번호 없음');
    }

    const gs = await this.gsApi.getGoogleSheetInstance();
    const data = [user.user_id, user.login, requestedAt, '', '', initialCardNo];
    try {
      await gs.spreadsheets.values.append({
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
      initial_card_no: initialCardNo,
      requested_at: requestedAt,
    };
  }
}
