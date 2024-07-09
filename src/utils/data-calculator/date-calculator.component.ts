import { Injectable, Logger } from '@nestjs/common';

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const HALF_DAY = HOUR * 24;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

/**
 * 날짜/시간 관련 연산을 하기 위한 모듈입니다.
 */
@Injectable()
export class DateCalculator {
  private logger = new Logger(DateCalculator.name);

  /**
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date Date 객체
   * @returns 인자로 주어진 일에 대해 가장 이른 시간
   */
  getStartOfDate(date: Date): Date {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return new Date(y, m, d, 0, 0, 0, 0);
  }

  /**
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date Date 객체
   * @returns 인자로 주어진 일에 대해 가장 늦은 시간
   */
  getEndOfDate(date: Date): Date {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const endOfDate = new Date(y, m, d + 1, 0, 0, 0, 0);
    endOfDate.setTime(endOfDate.getTime() - 1);
    return endOfDate;
  }

  //todo: 리팩터릭
  /**
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date Date 객체
   * @returns 인자로 주어진 일에 대해 바로 전날의 가장 늦은 시간
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
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date Date 객체
   * @returns 인자로 주어진 일에 대해 그 주의 첫 날짜(월요일)의 가장 빠른 시간
   */
  getStartOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay() - 1;
    const diff = dayOfWeek === -1 ? 6 : dayOfWeek;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
  }

  //todo: get, setTime대신 milliseconds를 써야하는가?
  /**
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date Date 객체
   * @returns 인자로 주어진 일에 대해 그 주의 마지막 날짜(일요일)의 가장 늦은 시간
   */
  getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setTime(endOfWeek.getTime() - 1);
    return endOfWeek;
  }

  /**
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date Date 객체
   * @returns 인자로 주어진 일에 대해 해당 월의 시작 시간
   */
  getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth());
  }

  /**
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date Date 객체
   * @returns 인자로 주어진 일에 대해 해당 월의 끝 시간을 반환합니다.
   */
  getEndOfMonth(date: Date): Date {
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1);
    endOfMonth.setTime(endOfMonth.getTime() - 1);
    return endOfMonth;
  }

  /**
   * NOTE: 서버의 로컬 시간에 맞게 동작함에 유의해야 함.
   *
   * @param date1 Date 객체 1
   * @param date2 Date 객체 2
   * @returns 두 date 객체가 동일한 날짜인지 체크합니다.
   */
  checkEqualDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * @param date Date 객체
   * @return Date 객체가 가리키고 있는 시간의 초 단위 타임스탬프
   */
  toTimestamp(date: Date): number {
    return Math.floor(date.getTime() / SEC);
  }

  /**
   * @param year 연도
   * @param month 월
   * @return 주어진 연도, 월에 대해 일의 개수
   */
  getDaysInMonth(year: number, month: number): number {
    const date = new Date(year, month, 0);
    return date.getDate();
  }

  /**
   * @param year 연도
   * @param week 주차
   * @returns 주어진 연도와 주차에 대해 날짜 범위를 구합니다.
   */
  getDateOfWeek(year: number, week: number): Date {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const daysToAdd = 7 - dayOfWeek;
    const secondSundayOfYear = new Date(year, 0, daysToAdd + 1);
    return new Date(secondSundayOfYear.getTime() + (week - 1) * WEEK);
  }

  /**
   * @returns 12시간을 초 단위로 변경한 것
   */
  getHalfDayInSeconds(): number {
    return HALF_DAY / SEC;
  }

  /**
   * @returns 하루를 초 단위로 변경한 것
   */
  getDayInSeconds(): number {
    return DAY / SEC;
  }

  /**
   * @param durationPerday 하루에 있었던 체류시간 (초 단위)
   * @returns 하루 단위로 초를 계산하여 12시간으로 나눈 나머지
   */
  cutTimeByLimit(durationPerday: number): number {
    const halfDayInSeconds = this.getHalfDayInSeconds();
    const dayInSeconds = this.getDayInSeconds();

    //todo: 음수인 경우가 있나요?
    //const seconds = durationPerday % dayInSeconds;
    const seconds =
      ((durationPerday % dayInSeconds) + dayInSeconds) % dayInSeconds;

    return seconds % halfDayInSeconds;
  }
}
