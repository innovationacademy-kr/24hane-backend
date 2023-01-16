import { Inject, Injectable, Logger } from '@nestjs/common';
import InOut from 'src/enums/inout.enum';
import { DateCalculator } from 'src/utils/date-calculator.component';
import { PairInfoDto } from './dto/pair-info.dto';
import { InOutLogType } from './dto/subType/InOutLog.type';
import { TagLogDto } from './dto/tag-log.dto';
import { IPairInfoRepository } from './repository/interface/pair-info-repository.interface';
import { ITagLogRepository } from './repository/interface/tag-log-repository.interface';
import { UserService } from 'src/user/user.service';
import { InOutDto } from './dto/inout.dto';

@Injectable()
export class TagLogService {
  private logger = new Logger(TagLogService.name);

  constructor(
    private userService: UserService,
    @Inject('ITagLogRepository')
    private tagLogRepository: ITagLogRepository,
    @Inject('IPairInfoRepository')
    private pairInfoRepository: IPairInfoRepository,
    private dateCalculator: DateCalculator,
  ) {}

  /**
   * 카드 태그 로그에 대해 로그 맨 앞, 맨 뒤 원소가 잘려 있다면 앞, 뒤에 가상의 입출입 로그를 삽입합니다.
   * 삽입하는 로그는 짝 여부에 관계없이 전후 원소를 삽입합니다.
   * 짝 일치 여부 판단은 다른 로직에서 진행합니다.
   * version 2: 카드의 짝을 맞추도록 수정하였습니다.
   *
   * @param taglogs TagLogDto[]
   * @return TagLogDto[]
   * @version 2
   */
  async trimTagLogs(
    taglogs: TagLogDto[],
    start: Date,
    end: Date,
  ): Promise<TagLogDto[]> {
    this.logger.debug(`@trimTagLogs)`);
    // 1. 맨 앞의 로그를 가져옴.
    const firstLog = taglogs.at(0);
    if (firstLog) {
      // 2. 맨 앞의 로그 이전의 로그를 가져옴.
      const beforeFirstLog = await this.tagLogRepository.findPrevTagLog(
        [firstLog.card_id],
        firstLog.tag_at,
      );
      // NOTE: tag log에 기록된 첫번째 로그가 퇴실인 경우 현재는 짝을 맞추지 않음.
      if (beforeFirstLog !== null) {
        const virtualEnterTime = this.dateCalculator.getStartOfDate(start);
        taglogs.unshift({
          tag_at: virtualEnterTime,
          device_id: beforeFirstLog.device_id,
          idx: -1,
          card_id: beforeFirstLog.card_id,
        });
      }
    }
    // 3. 맨 뒤의 로그를 가져옴.
    const lastLog = taglogs.at(-1);
    if (lastLog) {
      // 6. 맨 뒤의 로그 이후의 로그를 가져옴.
      const beforelastLog = await this.tagLogRepository.findNextTagLog(
        [lastLog.card_id],
        lastLog.tag_at,
      );
      // NOTE: 현재는 카뎃의 현재 입실여부에 관계없이 짝을 맞춤.
      if (beforelastLog !== null) {
        const virtualLeaveTime = this.dateCalculator.getEndOfDate(end);
        taglogs.push({
          tag_at: virtualLeaveTime,
          device_id: beforelastLog.device_id,
          idx: -1,
          card_id: beforelastLog.card_id,
        });
      }
    }
    return taglogs;
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
    this.logger.debug(`@validateDevicePair) ${inDevice} - ${outDevice}`);
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
    this.logger.debug(`@getPairsByTagLogs)`);
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
    this.logger.debug(`@getPerDay) ${userId}, ${date}`);
    const tagStart = this.dateCalculator.getStartOfDate(date);
    const tagEnd = this.dateCalculator.getEndOfDate(date);

    const pairs = await this.pairInfoRepository.findAll();

    const cards = await this.userService.findCardsByUserId(
      userId,
      tagStart,
      tagEnd,
    );

    const tagLogs = await this.tagLogRepository.findTagLogsByCards(
      cards,
      tagStart,
      tagEnd,
    );

    const sortedTagLogs = tagLogs.sort((a, b) =>
      a.tag_at > b.tag_at ? 1 : -1,
    );

    // FIXME: 임시 조치임
    const filteredTagLogs = sortedTagLogs.filter(
      (v) => v.device_id !== 35 && v.device_id !== 16,
    );

    const trimmedTagLogs = await this.trimTagLogs(
      filteredTagLogs,
      tagStart,
      tagEnd,
    );

    const resultPairs = this.getPairsByTagLogs(trimmedTagLogs, pairs);

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
    this.logger.debug(`@getPerMonth) ${userId}, ${date}`);
    const tagStart = this.dateCalculator.getStartOfMonth(date);
    const tagEnd = this.dateCalculator.getEndOfMonth(date);

    const pairs = await this.pairInfoRepository.findAll();

    const cards = await this.userService.findCardsByUserId(
      userId,
      tagStart,
      tagEnd,
    );

    const tagLogs = await this.tagLogRepository.findTagLogsByCards(
      cards,
      tagStart,
      tagEnd,
    );

    const sortedTagLogs = tagLogs.sort((a, b) =>
      a.tag_at > b.tag_at ? 1 : -1,
    );

    // FIXME: 임시 조치임
    const filteredTagLogs = sortedTagLogs.filter(
      (v) => v.device_id !== 35 && v.device_id !== 16,
    );

    const trimmedTagLogs = await this.trimTagLogs(
      filteredTagLogs,
      tagStart,
      tagEnd,
    );

    const resultPairs = this.getPairsByTagLogs(trimmedTagLogs, pairs);

    return resultPairs;
  }

  /**
   * 사용자가 클러스터에 체류중인지 확인합니다.
   *
   * @param userId 사용자 ID
   * @returns InOutDto
   */
  async checkClusterById(userId: number): Promise<InOutDto> {
    this.logger.debug(`@checkClusterById) ${userId}`);
    const cards = await this.userService.findCardsByUserId(
      userId,
      new Date('2019-01-01 00:00:00'),
      new Date(), // NOTE: 대략 42 클러스터 오픈일부터 지금까지 조회
    );
    const last = await this.tagLogRepository.findLatestTagLog(cards);
    const inCards = await this.pairInfoRepository.findInGates();

    if (last === null) {
      return {
        log: null,
        inout: InOut.OUT,
      };
    }

    const inout =
      inCards.find((card) => card === last.device_id) === undefined
        ? InOut.OUT
        : InOut.IN;

    return {
      log: last.tag_at,
      inout: inout,
    };
  }
}
