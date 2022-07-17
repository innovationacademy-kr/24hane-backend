import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Inout } from 'src/entities/inout.entity';
import { UsageResponseDto } from './dto/usage-response.dto';
import InOut from 'src/enums/inout.enum';

@Injectable()
export class UsageService {
  private logger = new Logger(UsageService.name);

  constructor(
    @InjectRepository(Inout)
    private webhookRepository: Repository<Inout>,
  ) {}

  /**
   * TODO 추후에 커스텀 리포지토리로 이동시킬 예정
   * 유저 ID와 시간 간격 사이에 체크인, 체크아웃한 기록을 가져옴
   *
   * @param id 인트라 ID
   * @param startDate 시작 시간
   * @param endDate 끝 시간
   * @returns InOut 엔티티 배열
   */
  async getInOutByIdAndDate(
    id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Inout[]> {
    return this.webhookRepository.findBy({
      intra_id: id,
      timestamp: Between(startDate, endDate),
    });
  }

  /**
   * TODO 추후에 커스텀 리포지토리로 이동시킬 예정
   * 유저 ID에 대한 가장 최신의 row를 가져옴
   *
   * @param id 인트라 ID
   * @returns InOut 엔티티
   */
  async getLatestDataById(id: string): Promise<Inout> {
    return this.webhookRepository
      .createQueryBuilder('inout')
      .where('inout.intra_id = :id', { id })
      .orderBy('inout.seq', 'DESC')
      .getOne();
  }

  getAccumulationTime(
    inout: Inout[],
    start: Date,
    end: Date,
    now?: Date,
  ): number {
    let durationTime = 0; // ms
    for (let i = 0; i < inout.length; i++) {
      if (inout[i].inout === InOut.OUT && i === 0) {
        // NOTE 시작시간 이전까지 클러스터에 있었을 때 시작시간을 대상으로 구함.
        durationTime += inout[i].timestamp.getTime() - start.getTime();
      } else if (inout[i].inout === InOut.IN && i === inout.length - 1) {
        // NOTE 끝시간 이후까지 클러스터에 있을 때 끝 시간을 대상으로 구하거나 구하지 말아야 함.
        if (now && end.getTime() <= now.getTime()) {
          // NOTE 현재 시간보다 끝 시간이 이전일 때는 구해야 함.
          durationTime += end.getTime() - inout[i].timestamp.getTime();
        }
      } else {
        if (inout[i].inout === InOut.OUT) {
          // NOTE Out이면 이전 값에 상관하지 않고 차를 구함.
          durationTime +=
            inout[i].timestamp.getTime() - inout[i - 1].timestamp.getTime();
        }
      }
    }
    return durationTime;
  }

  async getPerDay(userId: string, date: Date): Promise<UsageResponseDto> {
    const start = this.getStartOfDate(date);
    const end = this.getEndOfDate(date);
    this.logger.debug(
      `getPerDay(userId: ${userId}, date: ${start.toString()} < ${date.toString()} < ${end.toString()})`,
    );
    const result = await this.getInOutByIdAndDate(userId, start, end);
    const latest = await this.getLatestDataById(userId);
    const durationTime = this.getAccumulationTime(result, start, end);
    return {
      userId,
      profile: 'test',
      state: latest.inout,
      durationTime,
      fromDate: start,
      toDate: end,
    };
  }

  async getPerWeek(userId: string, date: Date): Promise<UsageResponseDto> {
    const start = this.getWeekOfMonday(date);
    const end = this.getWeekOfSunday(date);
    this.logger.debug(
      `getPerWeek(userId: ${userId}, date: ${start.toString()} < ${date.toString()} < ${end.toString()})`,
    );
    const result = await this.getInOutByIdAndDate(userId, start, end);
    const latest = await this.getLatestDataById(userId);
    const durationTime = this.getAccumulationTime(result, start, end);
    this.logger.debug(`getPerWeek(durationTime: ${durationTime} ms)`);
    return {
      userId,
      profile: 'test',
      state: latest.inout,
      durationTime: durationTime / 1000,
      fromDate: start,
      toDate: end,
    };
  }

  async getPerMonth(userId: string, date: Date): Promise<UsageResponseDto> {
    const start = this.getStartOfMonth(date);
    const end = this.getEndOfMonth(date);
    this.logger.debug(
      `getPerMonth(userId: ${userId}, date: ${start.toString()} < ${date.toString()} < ${end.toString()})`,
    );
    const result = await this.getInOutByIdAndDate(userId, start, end);
    const latest = await this.getLatestDataById(userId);
    const durationTime = this.getAccumulationTime(result, start, end);
    this.logger.debug(`getPerMonth(durationTime: ${durationTime} ms)`);
    return {
      userId,
      profile: 'test',
      state: latest.inout,
      durationTime: durationTime / 1000,
      fromDate: start,
      toDate: end,
    };
  }

  /**
   * 인자로 주어진 일에 대해 해당 월의 시작 시간을 반환합니다.
   *
   * @param date 임의의 시간
   * @returns date에 속한 월의 시작 시간
   */
  getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth());
  }

  /**
   * 인자로 주어진 일에 대해 해당 월의 끝 시간을 반환합니다.
   *
   * @param date 임의의 시간
   * @returns date에 속한 월의 끝 시간
   */
  getEndOfMonth(date: Date): Date {
    const rtn = new Date(date.getFullYear(), date.getMonth() + 1);
    rtn.setTime(rtn.getTime() - 1);
    return rtn;
  }

  /**
   * 인자로 주어진 일에 대해 해당 주의 월요일 (00시) 날짜를 반환합니다.
   */
  getWeekOfMonday(date: Date): Date {
    const day = date.getDay();
    const dist = day == 0 ? -6 : -day;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + dist,
      0,
      0,
      0,
      0,
    );
  }

  /**
   * 인자로 주어진 일에 대해 해당 주의 일요일 (23시) 날짜를 반환합니다.
   */
  getWeekOfSunday(date: Date): Date {
    const day = date.getDay();
    const dist = day == 0 ? 0 : 7 - day;
    const rtn = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + dist + 1,
      0,
      0,
      0,
      0,
    );
    rtn.setTime(rtn.getTime() - 1);
    return rtn;
  }

  /**
   * 인자로 주어진 일에 대해 가장 이른 시간을 반환합니다.
   */
  getStartOfDate(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );
  }

  /**
   * 인자로 주어진 일에 대해 가장 늦은 시간을 반환합니다.
   */
  getEndOfDate(date: Date): Date {
    const rtn = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0,
      0,
      0,
      0,
    );
    rtn.setTime(rtn.getTime() - 1);
    return rtn;
  }
}
