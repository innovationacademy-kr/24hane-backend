import { Inject, Injectable, Logger } from '@nestjs/common';
import { TagLog } from 'src/entities/tag-log.entity';
import { DateCalculator } from 'src/utils/date-calculator.component';
import { PairInfoDto } from './dto/pair-info.dto';
import { InOutLogType } from './dto/subType/InOutLog.type';
import { TagLogDto } from './dto/tag-log.dto';
import { IPairInfoRepository } from './repository/interface/pair-info-repository.interface';
import { ITagLogRepository } from './repository/interface/tag-log-repository.interface';
import { IUserInfoRepository } from './repository/interface/user-info-repository.interface';

@Injectable()
export class TagLogService {
  private logger = new Logger(TagLogService.name);

  constructor(
    @Inject('IUserInfoRepository')
    private userInfoRepository: IUserInfoRepository,
    @Inject('ITagLogRepository')
    private tagLogRepository: ITagLogRepository,
    @Inject('IPairInfoRepository')
    private pairInfoRepository: IPairInfoRepository,
    private dateCalculator: DateCalculator,
  ) {}

  /**
   * 사용자 ID로 사용자에 대한 카드 ID 목록을 반환합니다.
   *
   * @param userId 사용자 아이디
   * @param vaildEnd 최소 만료기간 (optional)
   * @param vaildStart 카드 발급한 기간보다 작은 기간 (optional)
   * @returns 카드 ID 목록 (배열)
   */
  async getCardIdsByUserId(
    userId: number,
    vaildEnd?: Date,
    vaildStart?: Date,
  ): Promise<string[]> {
    return this.userInfoRepository.findCardIds(userId, vaildEnd, vaildStart);
  }

  async getTagLogs(cardIDs: string[]): Promise<TagLog[]> {
    return this.tagLogRepository.findTagLogs(
      cardIDs,
      new Date('2022-07-31T16:02:32.000Z'),
      new Date('2099-09-09'),
    );
  }

  /**
   * 인자로 들어간 디바이스가 쌍이 맞는지 확인하는 함수입니다.
   *
   * @param deviceInfo
   * @param enterDevice
   * @param device
   */
  validateDevicePair(
    deviceInfos: PairInfoDto[],
    inDevice: number,
    outDevice: number,
  ): boolean {
    // TODO: O(N) 보다 더 적게 시간을 소요하도록 리팩터링 필요
    const find = deviceInfos.find(
      (device) =>
        device.in_device === inDevice && device.out_device === outDevice,
    );
    return !!find;
  }

  /**
   * 기기 쌍 정보와 태깅한 로그들을 이용하여 출입 로그를 반환합니다.
   *
   * @param taglogs 입출입 로그
   * @param deviceInfos 기기 짝 정보
   */
  getPairsByTagLogs(
    taglogs: TagLogDto[],
    deviceInfos: PairInfoDto[],
  ): InOutLogType[] {
    /**
     * 데이터를 날짜의 내림차순으로 정렬
     */
    // const timeLines = taglogs
    //   //.sort((a, b) => (a.tag_at < b.tag_at ? 1 : -1))
    //   .map((v) => ({
    //     tag_at: v.tag_at,
    //     device_id: v.device_id,
    //   }));
    const timeLines = taglogs;

    let leave: TagLogDto | null = null;
    const resultPairs: InOutLogType[] = [];

    // 타임라인 배열이 빌 때까지 루프를 돌립니다.
    while (timeLines.length > 0) {
      // 가장 뒤의 원소(가장 늦은 날짜)를 뽑습니다.
      const val = timeLines.pop();

      // 만약 퇴장로그로 가정한 로그가 없다면 뽑은 원소를 넣고 루프를 다시 실행합니다.
      if (leave === null) {
        leave = val;
        continue;
      }

      // 뽑아낸 원소를 임시로 저장합니다.
      const temp: TagLogDto | null = val;

      // 퇴장로그로 가정한 로그와 현재 뽑아낸 로그가 기기 짝이 맞는지 확인합니다.
      if (
        this.validateDevicePair(deviceInfos, temp.device_id, leave.device_id)
      ) {
        // 기기 짝이 맞을 경우 임시 원소를 입장 로그로 지정합니다.
        const enter = temp;

        // 입장 로그와 퇴장 로그가 짝이 맞는지 확인합니다.
        if (this.dateCalculator.checkEqualDay(enter.tag_at, leave.tag_at)) {
          // 만약 동일한 날짜에 속한다면 해당 쌍이 짝이 됩니다.
          const inTimeStamp = this.dateCalculator.toTimestamp(enter.tag_at);
          const outTimeStamp = this.dateCalculator.toTimestamp(leave.tag_at);
          resultPairs.push({
            inTimeStamp,
            outTimeStamp,
            durationSecond: outTimeStamp - inTimeStamp,
          });
        } else {
          // 만약 입장 로그와 퇴장 로그가 짝이 맞지만, 동일한 날짜에 속하지 않으면 일 단위로 자릅니다.

          // 퇴장 로그의 정시 (00시)를 기준으로 두 날짜의 간격을 자릅니다. 두 날짜는 가상의 입퇴장 짝이 됩니다.
          const virtualEnterTime = this.dateCalculator.getStartOfDate(
            leave.tag_at,
          );
          const virtualLeaveTime = this.dateCalculator.getEndOfLastDate(
            leave.tag_at,
          );

          // 가상 입장시간 (퇴장시간의 날짜의 정시 - 00시)과 퇴장시간이 짝을 맞춥니다.
          const inTimeStamp = this.dateCalculator.toTimestamp(virtualEnterTime);
          const outTimeStamp = this.dateCalculator.toTimestamp(leave.tag_at);
          resultPairs.push({
            inTimeStamp,
            outTimeStamp,
            durationSecond: outTimeStamp - inTimeStamp,
          });

          // 그리고 가상 퇴장시간을 다시 배열에 넣어 가상 퇴장시간과 맞는 짝을 찾습니다.
          timeLines.push(val);
          timeLines.push({
            tag_at: virtualLeaveTime,
            device_id: leave.device_id,
            idx: -1,
            card_id: val.card_id,
          });
        }

        // 퇴장로그로 가정한 로그를 초기화합니다.
        leave = null;
      } else {
        // pair가 아닌 경우 뽑아낸 로그를 퇴장로그로 가정하고 루프를 다시 실행합니다.
        leave = temp;
      }
    }
    return resultPairs;
  }

  /**
   * 인자로 들어가는 사용자 ID와 날짜에 대한 일별 누적시간을 반환합니다.
   *
   * @param userId 사용자 ID
   * @param date 날짜
   * @returns InOutLogType[]
   */
  async getPerDay(userId: number, date: Date): Promise<InOutLogType[]> {
    const cardStart = this.dateCalculator.getStartOfDate(date);
    const cardEnd = new Date('9999-08-05 23:59:59');
    const tagStart = this.dateCalculator.getStartOfDate(date);
    const tagEnd = this.dateCalculator.getEndOfDate(date);

    const pairs = await this.pairInfoRepository.findAll();

    const cardIds = await this.userInfoRepository.findCardIds(
      userId,
      cardStart,
      cardEnd,
    );

    const tagLogs = await this.tagLogRepository.findTagLogs(
      cardIds,
      tagStart,
      tagEnd,
    );

    const resultPairs = this.getPairsByTagLogs(tagLogs, pairs);

    return resultPairs;
  }

  /**
   * 인자로 들어가는 사용자 ID와 날짜에 대한 월별 누적시간을 반환합니다.
   *
   * @param userId 사용자 ID
   * @param date 날짜
   * @returns InOutLogType[]
   */
  async getPerMonth(userId: number, date: Date): Promise<InOutLogType[]> {
    const cardStart = this.dateCalculator.getStartOfMonth(date);
    const cardEnd = new Date('9999-08-05 23:59:59');
    const tagStart = this.dateCalculator.getStartOfMonth(date);
    const tagEnd = this.dateCalculator.getEndOfMonth(date);

    const pairs = await this.pairInfoRepository.findAll();

    const cardIds = await this.userInfoRepository.findCardIds(
      userId,
      cardStart,
      cardEnd,
    );

    const tagLogs = await this.tagLogRepository.findTagLogs(
      cardIds,
      tagStart,
      tagEnd,
    );

    const resultPairs = this.getPairsByTagLogs(tagLogs, pairs);

    return resultPairs;
  }
}
