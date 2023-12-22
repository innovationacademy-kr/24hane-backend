import { ApiProperty } from '@nestjs/swagger';
import { InOutLogType } from './InOutLog.type';

export class InOutLogPerDay {
  @ApiProperty({
    description: '하루 단위 입출입 로그',
    example: [
      {
        inTimeStamp: 1658980000,
        outTimeStamp: 1658989999,
        durationSecond: 9999,
      },
      {
        inTimeStamp: 1658980000,
        outTimeStamp: 1658989999,
        durationSecond: 9999,
      },
    ],
  })
  inOutLogs: InOutLogType[] | null;

  durationSecondsPerday: number | null = null;

  setDurationSecondsPerday(limitTime: number): void {
    this.durationSecondsPerday = this.calculateDurationSeconds(limitTime);
  }

  private calculateDurationSeconds(limitTime: number): number {
    return (
      this.inOutLogs?.reduce((total, log) => {
        if (log.durationSecond !== null) {
          const remainingTime = limitTime - total;
          total += Math.min(log.durationSecond, remainingTime);
        }
        return total;
      }, 0) || 0
    );
  }

  getDurationSecondWithFilter(limitTime: number): number {
    return this.calculateDurationSeconds(limitTime);
  }

  getDurationSecondPerDay(): number {
    return this.durationSecondsPerday || 0;
  }
}

export function groupLogsByDay(
  logs: InOutLogType[],
  limitTime: number,
): InOutLogPerDay[] {
  const result: InOutLogPerDay[] = [];

  const dateGroups = new Map<string, InOutLogType[]>();

  // 로그를 날짜별로 그룹화
  logs.forEach((log) => {
    if (log.inTimeStamp && log.outTimeStamp) {
      const date = new Date(log.inTimeStamp * 1000);

      const inDate = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
      }).format(date);

      if (!dateGroups.has(inDate)) {
        dateGroups.set(inDate, []);
      }

      dateGroups.get(inDate)?.push(log);
    }
  });

  // 그룹화된 로그를 InOutLogPerDay로 변환
  dateGroups.forEach((logs) => {
    const inOutLogPerDay = new InOutLogPerDay();
    inOutLogPerDay.inOutLogs = logs;
    inOutLogPerDay.setDurationSecondsPerday(limitTime); // 12시간을 초로 변환
    result.push(inOutLogPerDay);
  });

  return result;
}
