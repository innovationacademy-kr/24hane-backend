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

  async getPerDay(userId: string, date: Date): Promise<UsageResponseDto> {
    const start = this.getStartOfDate(date);
    const end = this.getEndOfDate(date);
    this.logger.debug(
      `getPerDay(userId: ${userId}, date: ${start.toString()} < ${date.toString()} < ${end.toString()})`,
    );
    const result = await this.webhookRepository.findBy({
      intra_id: userId,
      timestamp: Between(start, end),
    });
    const latest = await this.webhookRepository
      .createQueryBuilder('inout')
      .where('inout.intra_id = :userId', { userId })
      .orderBy('inout.seq', 'DESC')
      .getOne();
    let durationTime = 0; // ms
    for (let i = 0; i < result.length; i++) {
      if (result[i].inout === InOut.OUT && i === 0) {
        // NOTE 이전까지 클러스터에 있었을 때
        durationTime += result[i].timestamp.getTime() - start.getTime();
      } else if (result[i].inout === InOut.IN && i === result.length - 1) {
        // NOTE 이후까지 클러스터에 있을 때
        // NOTE 상황에 따라 다른데... 고민 필요... 일단 보류
      } else {
        if (result[i].inout === InOut.OUT) {
          durationTime +=
            result[i].timestamp.getTime() - result[i - 1].timestamp.getTime();
        }
      }
    }
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
    const result = await this.webhookRepository.findBy({
      intra_id: userId,
      timestamp: Between(start, end),
    });
    const latest = await this.webhookRepository
      .createQueryBuilder('inout')
      .where('inout.intra_id = :userId', { userId })
      .orderBy('inout.seq', 'DESC')
      .getOne();
    let durationTime = 0; // ms
    for (let i = 0; i < result.length; i++) {
      if (result[i].inout === InOut.OUT && i === 0) {
        // NOTE 이전까지 클러스터에 있었을 때
        durationTime +=
          result[i].timestamp.getTime() -
          this.getStartOfDate(result[i].timestamp).getTime();
      } else if (result[i].inout === InOut.IN && i === result.length - 1) {
        // NOTE 이후까지 클러스터에 있을 때
        // NOTE 상황에 따라 다른데... 고민 필요... 일단 보류
      } else {
        if (result[i].inout === InOut.OUT) {
          durationTime +=
            result[i].timestamp.getTime() - result[i - 1].timestamp.getTime();
        }
      }
    }
    console.log(latest);
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
    const result = await this.webhookRepository.findBy({
      intra_id: userId,
      timestamp: Between(start, end),
    });
    const latest = await this.webhookRepository
      .createQueryBuilder('inout')
      .where('inout.intra_id = :userId', { userId })
      .orderBy('inout.seq', 'DESC')
      .getOne();
    let durationTime = 0; // ms
    for (let i = 0; i < result.length; i++) {
      if (result[i].inout === InOut.OUT && i === 0) {
        // NOTE 이전까지 클러스터에 있었을 때
        durationTime += result[i].timestamp.getTime() - start.getTime();
      } else if (result[i].inout === InOut.IN && i === result.length - 1) {
        // NOTE 이후까지 클러스터에 있을 때
        // NOTE 상황에 따라 다른데... 고민 필요... 일단 보류
      } else {
        if (result[i].inout === InOut.OUT) {
          durationTime +=
            result[i].timestamp.getTime() - result[i - 1].timestamp.getTime();
        }
      }
    }
    console.log(latest);
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
