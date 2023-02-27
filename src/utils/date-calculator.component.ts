import { Injectable, Logger } from '@nestjs/common';

/**
 * 날짜/시간 관련 연산을 하기 위한 모듈입니다.
 */
@Injectable()
export class DateCalculator {
  private logger = new Logger(DateCalculator.name);

  /**
   * 인자로 주어진 일에 대해 가장 이른 시간을 반환합니다.
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   */
  getStartOfDate(date: Date): Date {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return new Date(y, m, d, 0, 0, 0, 0);
  }

  /**
   * 인자로 주어진 일에 대해 가장 늦은 시간을 반환합니다.
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   */
  getEndOfDate(date: Date): Date {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const rtn = new Date(y, m, d + 1, 0, 0, 0, 0);
    rtn.setTime(rtn.getTime() - 1);
    return rtn;
  }

  getEndOfWeek(date: Date): Date {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const rtn = new Date(y, m, d + 7, 0, 0, 0, 0);
    rtn.setTime(rtn.getTime() - 1);
    return rtn;
  }

  /**
   * 인자로 주어진 일에 대해 바로 전날의 가장 늦은 시간을 반환합니다.
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   */
  getEndOfLastDate(date: Date): Date {
    const rtn = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );
    rtn.setTime(rtn.getTime() - 1);
    return rtn;
  }

  /**
   * 인자로 주어진 일에 대해 해당 월의 시작 시간을 반환합니다.
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date 임의의 시간
   * @returns date에 속한 월의 시작 시간
   */
  getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth());
  }

  /**
   * 인자로 주어진 일에 대해 해당 월의 끝 시간을 반환합니다.
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
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
   * 두 date 객체가 동일한 날짜인지 체크합니다.
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date1 date 객체 1
   * @param date2 date 객체 2
   */
  checkEqualDay(date1: Date, date2: Date) {
    //this.logger.debug(`@checkEqualDay) ${date1}, ${date2}`);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Date 객체가 가리키고 있는 시간을 타임스탬프로 반환합니다.
   *
   * @param date Date 객체
   * @return number 타임스탬프
   */
  toTimestamp(date: Date): number {
    //this.logger.debug(`@toTimestamp) ${date}`);
    return Math.floor(date.getTime() / 1000);
  }

  /**
   * 주어진 년, 월에 대해 일의 개수를 구합니다.
  *
  * @param year 년
  * @param month 월
  * @return days 해당 달의 일의 개수
  */
  getDaysInMonth(year: number, month: number): number {
    this.logger.debug(`@getDaysInMonth) ${year}, ${month}`);
    const date = new Date(year, month, 0);
    return date.getDate();
  }

  /**
   * 주어진 년도와 주차에 대해 날짜 범위를 구합니다.
   * 
   * @param year 년
   * @param week 주차
   * @returns 
  */
  getDateOfWeek(year: number, week: number): Date {
    const januaryFirst = new Date(year, 0, 1);
    const dayOfWeek = januaryFirst.getDay();
    const daysToAdd = 7 - dayOfWeek;
    const secondSundayOfYear = new Date(year, 0, daysToAdd + 1);
    const rtn = new Date(secondSundayOfYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
    return rtn;
  }
}
