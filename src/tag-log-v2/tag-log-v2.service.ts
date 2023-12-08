import { Inject, Injectable, Logger } from '@nestjs/common';
import { DateCalculator } from 'src/data-calculator/date-calculator.component';
import InOut from 'src/enums/inout.enum';
import { CardDto } from 'src/user/dto/card.dto';
import { UserService } from 'src/user/user.service';
import { DeviceInfoDto } from './dto/device-info.dto';
import { InOutDto } from './dto/inout.dto';
import { PairInfoDto } from './dto/pair-info.dto';
import { InOutLogType } from './dto/subType/InOutLog.type';
import { TagLogDto } from './dto/tag-log.dto';
import { IDeviceInfoRepository } from './repository/interface/device-info-repository.interface';
import { IPairInfoRepository } from './repository/interface/pair-info-repository.interface';
import { ITagLogRepository } from './repository/interface/tag-log-repository.interface';

@Injectable()
export class TagLogService {
  private logger = new Logger(TagLogService.name);

  constructor(
    private userService: UserService,
    @Inject('ITagLogRepository')
    private tagLogRepository: ITagLogRepository,
    @Inject('IPairInfoRepository')
    private pairInfoRepository: IPairInfoRepository,
    @Inject('IDeviceInfoRepository')
    private deviceInfoRepository: IDeviceInfoRepository,
    private dateCalculator: DateCalculator,
  ) {}

  /**
   * DB에서 중복된 태그 기록이 올 경우, 중복된 태그 기록을 필터링합니다.
   * 중복 기준은 태그 시간, 태그 ID, 태그 기기입니다.
   *
   * @param taglogs TagLogDto[]
   * @return TagLogDto[]
   */
  removeDuplicates(taglogs: TagLogDto[]): TagLogDto[] {
    const comp = (a: TagLogDto, b: TagLogDto) =>
      a.tag_at.getTime() === b.tag_at.getTime() &&
      a.card_id === b.card_id &&
      a.device_id === b.device_id;
    return taglogs.reduce(
      (acc, tag) => (acc.find((val) => comp(val, tag)) ? acc : [...acc, tag]),
      [],
    );
  }

  /**
   * 인자로 들어온 태그 로그의 첫 기록이 OUT이라면, 더 과거 로그를 가져와 정각 기준으로 가상 로그를 삽입합니다.
   *
   * @param taglogs TagLogDto[] 태그 로그
   * @param cards CardDto[] 태깅한 유저의 카드 정보와 유효 기간
   * @param deviceInfos DeviceInfoDto[] 디바이스 정보
   * @return TagLogDto[] 태그 로그
   * @version 1
   */
  async checkAndInsertStartVirtualTagLog(
    taglogs: TagLogDto[],
    cards: CardDto[],
    deviceInfos: DeviceInfoDto[],
  ): Promise<TagLogDto[]> {
    // 1. 맨 앞의 로그를 가져온다.
    const firstLog = taglogs.at(0);

    // 2. 만약 맨 앞의 로그가 OUT이라면 맨 앞의 로그 이전의 로그를 가져온다.
    if (
      firstLog &&
      !!deviceInfos.find(
        (v) => v.device_id === firstLog.device_id && v.io_type === InOut.OUT,
      )
    ) {
      const beforeFirstLog = await this.tagLogRepository.findPrevTagLog(
        cards.find((v) => v.card_id === firstLog.card_id),
        firstLog.tag_at,
      );
      // 3. 만약 맨 앞의 로그 이전의 로그가 IN이 아니라면, 가상 로그를 삽입하지 않는다.
      if (
        beforeFirstLog !== null &&
        !!deviceInfos.find(
          (v) =>
            v.device_id === beforeFirstLog.device_id && v.io_type === InOut.IN,
        )
      ) {
        const virtualEnterTime = this.dateCalculator.getStartOfDate(
          firstLog.tag_at,
        );
        taglogs.unshift({
          tag_at: virtualEnterTime,
          device_id: beforeFirstLog.device_id,
          idx: -1,
          card_id: beforeFirstLog.card_id,
        });
      }
    }
    return taglogs;
  }

  /**
   * 인자로 들어온 태그 로그의 마지막 기록이 IN이라면, 더 최신 로그를 가져와 정각 기준으로 가상 로그를 삽입합니다.
   *
   * @param taglogs TagLogDto[] 태그 로그
   * @param cards CardDto[] 태깅한 유저의 카드 정보와 유효 기간
   * @param deviceInfos DeviceInfoDto[] 디바이스 정보
   * @return TagLogDto[] 태그 로그
   * @version 1
   */
  async checkAndInsertEndVirtualTagLog(
    taglogs: TagLogDto[],
    cards: CardDto[],
    deviceInfos: DeviceInfoDto[],
  ): Promise<TagLogDto[]> {
    // 1. 맨 뒤의 로그를 가져온다.
    const lastLog = taglogs.at(-1);

    // 2. 만약 맨 뒤의 로그가 IN이라면 맨 뒤의 로그 이후의 로그를 가져온다.
    if (
      lastLog &&
      !!deviceInfos.find(
        (v) => v.device_id === lastLog.device_id && v.io_type === InOut.IN,
      )
    ) {
      const afterLastLog = await this.tagLogRepository.findNextTagLog(
        cards.find((v) => v.card_id === lastLog.card_id),
        lastLog.tag_at,
      );

      // 3. 만약 맨 뒤의 로그 이후의 로그가 OUT이 아니라면, 가상 로그를 삽입하지 않는다.
      if (
        afterLastLog !== null &&
        !!deviceInfos.find(
          (v) =>
            v.device_id === afterLastLog.device_id && v.io_type === InOut.OUT,
        )
      ) {
        const virtualLeaveTime = this.dateCalculator.getEndOfDate(
          lastLog.tag_at,
        );

        taglogs.push({
          tag_at: virtualLeaveTime,
          device_id: afterLastLog.device_id,
          idx: -1,
          card_id: afterLastLog.card_id,
        });

        const nextDayOfLastLog = new Date(lastLog.tag_at);
        nextDayOfLastLog.setDate(nextDayOfLastLog.getDate() + 1);

        while (
          !this.dateCalculator.checkEqualDay(
            nextDayOfLastLog,
            afterLastLog.tag_at,
          )
        ) {
          taglogs.push({
            //IN
            tag_at: this.dateCalculator.getStartOfDate(nextDayOfLastLog),
            device_id: lastLog.device_id,
            idx: -1,
            card_id: lastLog.card_id,
          });
          taglogs.push({
            //OUT
            tag_at: this.dateCalculator.getEndOfDate(nextDayOfLastLog),
            device_id: afterLastLog.device_id,
            idx: -1,
            card_id: afterLastLog.card_id,
          });
          nextDayOfLastLog.setDate(nextDayOfLastLog.getDate() + 1);
        }
      }
    }
    return taglogs;
  }

  ///**
  // * 인자로 들어간 디바이스가 쌍이 맞는지 확인하는 함수입니다.
  // *
  // * @param deviceInfo
  // * @param enterDevice
  // * @param device
  // */
  validateDevicePair(
    deviceInfos: PairInfoDto[],
    inDevice: number,
    outDevice: number,
  ): boolean {
    //this.logger.debug(`@validateDevicePair) ${inDevice} - ${outDevice}`);
    // TODO: O(N) 보다 더 적게 시간을 소요하도록 리팩터링 필요
    const find = deviceInfos.find(
      (device) =>
        device.in_device === inDevice && device.out_device === outDevice,
    );
    return !!find;
  }

  /**
   * 인자로 들어간 디바이스 번호가 입실 디바이스인지 확인합니다.
   *
   * @param deviceInfos
   * @param targetDevice
   */
  isInDevice(deviceInfos: PairInfoDto[], targetDevice: number): boolean {
    const inDevice = deviceInfos.find(
      (deviceInfo) => deviceInfo.in_device === targetDevice,
    );

    return !!inDevice;
  }

  /**
   * 인자로 들어간 디바이스 번호가 퇴실 디바이스인지 확인합니다.
   *
   * @param deviceInfos
   * @param targetDevice
   */
  isOutDevice(deviceInfos: PairInfoDto[], targetDevice: number): boolean {
    const outDevice = deviceInfos.find(
      (deviceInfo) => deviceInfo.out_device === targetDevice,
    );

    return !!outDevice;
  }

  /**
   * 기기 쌍 정보와 태깅한 로그들을 이용하여
   * 짝이 맞지 않는 출입로그도 null과 함께 반환합니다.
   *
   * @param taglogs 입출입 로그
   * @param deviceInfos 기기 짝 정보
   */
  getAllPairsByTagLogs(
    taglogs: TagLogDto[],
    deviceInfos: PairInfoDto[],
  ): InOutLogType[] {
    this.logger.debug(`@getAllPairsByTagLogs)`);

    const timeLines = taglogs;
    const resultPairs: InOutLogType[] = [];

    let temp: TagLogDto | null = null;
    let leave: TagLogDto | null = null;

    // 타임라인 배열이 빌 때까지 루프를 돌립니다.
    while (timeLines.length > 0) {
      if (temp === null) {
        if (timeLines.length > 0) {
          temp = timeLines.pop();
        } else {
          break;
        }
      }

      // 내부에 있거나 중복 입실태그인 경우
      if (this.isInDevice(deviceInfos, temp.device_id)) {
        const inTimeStamp = this.dateCalculator.toTimestamp(temp.tag_at);
        const outTimeStamp = null;
        const durationSecond = null;
        resultPairs.push({
          inTimeStamp,
          outTimeStamp,
          durationSecond,
        });
        temp = null;
        //this.logger.debug(`입실 중복`);
        continue;
      }

      if (leave === null) {
        leave = temp;
        temp = null;
      }

      if (temp === null) {
        if (timeLines.length > 0) {
          temp = timeLines.pop();
        } else {
          break;
        }
      }

      //this.logger.debug(`temp2:`, temp.device_id, temp.tag_at);

      // 중복 퇴실태그인 경우
      if (this.isOutDevice(deviceInfos, temp.device_id)) {
        const inTimeStamp = null;
        const outTimeStamp = this.dateCalculator.toTimestamp(leave.tag_at);
        const durationSecond = null;
        resultPairs.push({
          inTimeStamp,
          outTimeStamp,
          durationSecond,
        });
        leave = null;
        //this.logger.debug(`퇴실 중복`);
        continue;
      }

      if (this.dateCalculator.checkEqualDay(temp.tag_at, leave.tag_at)) {
        //this.logger.debug(`정상 태그 (같은 날)`);
        // 만약 동일한 날짜에 속한다면 해당 쌍이 짝이 됩니다.
        const inTimeStamp = this.dateCalculator.toTimestamp(temp.tag_at);
        const outTimeStamp = this.dateCalculator.toTimestamp(leave.tag_at);
        resultPairs.push({
          inTimeStamp,
          outTimeStamp,
          durationSecond: outTimeStamp - inTimeStamp,
        });
      } else {
        //this.logger.debug(`정상 태그 (다른 날)`);
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
        timeLines.push(temp); //todo: temp? leave?
        timeLines.push({
          tag_at: virtualLeaveTime,
          device_id: leave.device_id,
          idx: -1,
          card_id: temp.card_id,
        });
      }

      temp = null;
      leave = null;
    }

    return resultPairs;
  }

  /**
   * tagStart에서 tagEnd의 기간 내에 userId의 태그로그를 전부 반환합니다.
   * 24시를 기준으로 가상 태그로그가 포함되어 있습니다.
   *
   * @param userId number
   * @param tagStart Date
   * @param tagEnd Date
   * @returns TagLogDto[]
   */
  async getAllTagLogsByPeriod(
    userId: number,
    tagStart: Date,
    tagEnd: Date,
  ): Promise<TagLogDto[]> {
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

    const deviceInfos = await this.deviceInfoRepository.findAll();

    const filteredTagLogs = sortedTagLogs.filter(
      (taglog) =>
        !!deviceInfos.find((temp) => temp.device_id === taglog.device_id),
    );

    const deduplicatedTagLogs = this.removeDuplicates(filteredTagLogs);

    const trimmedStartTagLogs = await this.checkAndInsertStartVirtualTagLog(
      deduplicatedTagLogs,
      cards,
      deviceInfos,
    );

    const trimmedTagLogs = await this.checkAndInsertEndVirtualTagLog(
      trimmedStartTagLogs,
      cards,
      deviceInfos,
    );

    return trimmedTagLogs;
  }

  /**
   * 일별 모든 태그를 반환합니다.
   *
   * @param userId 사용자 ID
   * @param date 날짜
   * @returns InOutLogType[]
   */
  async getAllTagPerDay(userId: number, date: Date): Promise<InOutLogType[]> {
    this.logger.debug(`@getAllTagPerDay) ${userId}, ${date}`);

    const pairs = await this.pairInfoRepository.findAll();

    const tagStart = this.dateCalculator.getStartOfDate(date);
    const tagEnd = this.dateCalculator.getEndOfDate(date);

    const taglogs = await this.getAllTagLogsByPeriod(userId, tagStart, tagEnd);

    //짝이 안맞는 로그도 null과 pair를 만들어 반환한다.
    const resultPairs = this.getAllPairsByTagLogs(taglogs, pairs);

    return resultPairs;
  }

  /**
   * 인자로 들어가는 사용자 ID와 날짜에 대한 주별 누적시간을 배열로 반환합니다.
   * 배열의 첫 인자가 현 주차의 누적시간입니다.
   * 한 주의 기준은 월요일~일요일 입니다.
   *
   * @param userId 사용자 ID
   * @returns number[]
   */
  async getTimeSixWeek(userId: number): Promise<number[]> {
    const today = new Date();
    //today.setDate(today.getDate()-3); //일요일 테스트
    const endOfSixWeek = this.dateCalculator.getEndOfWeek(today);
    const beforeSixWeek = this.dateCalculator.getStartOfWeek(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5 * 7),
    );
    const endOfWeek = this.dateCalculator.getEndOfWeek(beforeSixWeek);

    this.logger.debug(`@getTimeSixWeek) ${today}-${beforeSixWeek}`);

    const pairs = await this.pairInfoRepository.findAll();

    const taglogs = await this.getAllTagLogsByPeriod(
      userId,
      beforeSixWeek,
      today,
    );

    const resultPairs = this.getAllPairsByTagLogs(taglogs, pairs);

    const ret: number[] = [];

    while (endOfWeek <= endOfSixWeek) {
      let totalSecond = 0;

      const weekPairs = resultPairs.filter(
        (resultPair) =>
          beforeSixWeek <= new Date(resultPair.inTimeStamp * 1000) &&
          new Date(resultPair.inTimeStamp * 1000) <= endOfWeek,
      );

      weekPairs.forEach((weekPair) => (totalSecond += weekPair.durationSecond));

      ret.push(totalSecond);

      beforeSixWeek.setDate(beforeSixWeek.getDate() + 7);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
    }

    return ret.reverse();
  }

  /**
   * 인자로 들어가는 사용자 ID와 날짜에 대한 월별 모든 태그를 반환합니다.
   *
   * @param userId 사용자 ID
   * @param date 날짜
   * @returns InOutLogType[]
   */
  async getAllTagPerMonth(userId: number, date: Date): Promise<InOutLogType[]> {
    this.logger.debug(`@getTagPerMonth) ${userId}, ${date}`);
    const tagStart = this.dateCalculator.getStartOfMonth(date);
    const tagEnd = this.dateCalculator.getEndOfMonth(date);

    const pairs = await this.pairInfoRepository.findAll();

    const taglogs = await this.getAllTagLogsByPeriod(userId, tagStart, tagEnd);

    const resultPairs = this.getAllPairsByTagLogs(taglogs, pairs);

    return resultPairs;
  }

  /**
   * 인자로 들어가는 사용자 ID와 날짜에 대한 월별 누적시간을 배열로 반환합니다.
   * 배열의 첫 인자가 현재 달의 누적시간입니다.
   *
   * @param userId 사용자 ID
   * @returns number[]
   */
  async getTimeSixMonth(userId: number): Promise<number[]> {
    this.logger.debug(`@getTagPerMonth) by ${userId}`);
    const today = new Date();
    const beforeSixMonth = new Date(today.getFullYear(), today.getMonth() - 5);
    let endOfMonth = this.dateCalculator.getEndOfMonth(beforeSixMonth);

    const pairs = await this.pairInfoRepository.findAll();

    const taglogs = await this.getAllTagLogsByPeriod(
      userId,
      beforeSixMonth,
      today,
    );

    const resultPairs = this.getAllPairsByTagLogs(taglogs, pairs);

    const ret: number[] = [];

    while (beforeSixMonth <= today) {
      let totalSecond = 0;

      const monthPairs = resultPairs.filter(
        (resultPair) =>
          beforeSixMonth <= new Date(resultPair.inTimeStamp * 1000) &&
          new Date(resultPair.inTimeStamp * 1000) <= endOfMonth,
      );

      monthPairs.forEach(
        (monthPairs) => (totalSecond += monthPairs.durationSecond),
      );

      ret.push(totalSecond);

      beforeSixMonth.setMonth(beforeSixMonth.getMonth() + 1);
      endOfMonth = this.dateCalculator.getEndOfMonth(beforeSixMonth);
    }

    return ret.reverse();
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
