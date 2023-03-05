import axios from 'axios';
import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserSessionDto } from '../auth/dto/user.session.dto';
import { IUserCardRepository } from './repository/interface/user-card-no.repository.interface';
import { reissueSateDto } from './dto/reissueState.dto';
import { reissueRequestDto } from './dto/reissueRequest.dto';
import { reissueFinishedDto } from './dto/reissueFinished.dto';
import { GoogleApi } from 'src/utils/google-api.component';

@Injectable()
export class ReissueService {
  constructor(
    private googleApi: GoogleApi,
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject('IUserCardRepository')
    private UserCardRepository: IUserCardRepository,
  ) {}

  private logger = new Logger(ReissueService.name);
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
   * 사용자의 출입카드 재신청에 대한 상태를 반환합니다.
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
    const result = await this.googleApi.getAllValues();
    const filtered = [];
    let state = '';
    for (const row of result) {
      if (row[0] == user_id) {
        filtered.push(row);
      }
    }
    if (!filtered.length) {
      return { state: 'none' };
    }
    const recent = filtered.pop();
    const isRequested = recent[3];
    const isIssued = recent[4];
    const isPickedUp = recent[5];
    if (isIssued) {
      if (isPickedUp) {
        state = 'done';
      } else {
        state = 'pick_up_requested';
      }
    } else {
      if (isRequested) {
        state = 'in_progress';
      } else {
        state = 'apply';
      }
    }
    return { state: state };
  }

  /**
   * 사용자의 카드 재발급 신청을 구글스프레드시트에 추가합니다.
   * @param user 사용자
   * @returns 출입카드 재신청 reissueRequestDto
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

    const data = [
      user.user_id,
      user.login,
      requestedAt,
      '',
      '',
      '',
      initialCardNo,
    ];
    await this.googleApi.appendValues(data);

    try {
      const jandiData = {
        request: 'request',
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
      throw new HttpException(
        `카드 재발급 신청 잔디알림 실패: ${error.message}`,
        513,
      );
    }
    return {
      login: user.login,
      requested_at: requestedAt,
    };
  }
  /**
   * 최신 재발급 신청내역에 대하여 구글스프레드 시트의 수령완료 행을 업데이트합니다.
   * @param user 사용자
   * @returns 출입카드 재신청 상태 reissueFinishedDto
   */
  async patchReissueState(user: UserSessionDto): Promise<reissueFinishedDto> {
    this.logger.debug(
      `@patchReissueState) ${user.login} requested for card reissuance.`,
    );
    const result = await this.googleApi.getAllValues();
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

    const initialCardNo = recent['row'][6];
    const newCardNo = recent['row'][7];
    // if (!newCardNo) {
    //   throw new HttpException('변경카드번호 없음', 512);
    // }
    const rowNum = recent['index'] + 1;
    await this.googleApi.updateValues(rowNum, 'O');

    const pickedUpAt = this.getTimeNowKST();
    try {
      const jandiData = {
        request: 'finish',
        login: user.login,
        initial_card_no: initialCardNo,
        new_card_no: newCardNo,
        picked_up_at: pickedUpAt,
      };
      await axios.post(this.jandiWebhook, jandiData);
      this.logger.debug(
        `@patchReissueState) send jandi alarm for closing ${user.login}'s card reissuance request`,
      );
    } catch (error) {
      this.logger.error(
        `@patchReissueState) failed to alarm jandi for new card issuance for ${user.login}: ${error.message}`,
      );
      throw new HttpException('재발급 카드 수령완료 잔디알림 실패', 513);
    }
    return {
      login: user.login,
      picked_up_at: pickedUpAt,
    };
  }
}
