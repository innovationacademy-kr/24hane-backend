import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { DateCalculator } from 'src/utils/date-calculator.component';
import { UserAccumulationDayType } from './dto/admin/user-accumulation-day.type';
import { UserAccumulationMonthType } from './dto/admin/user-accumulation-month.type';
import { TagLogService } from './tag-log-v2.service';

@Injectable()
export class TagLogCabiService {
  private logger = new Logger(TagLogCabiService.name);

  constructor(
    private userService: UserService,
    private tagLogService: TagLogService,
    private dateCalculator: DateCalculator,
  ) {}

  genDayType(
    id: number,
    login: string,
    arr: number[],
  ): UserAccumulationDayType {
    this.logger.debug(`@genDayType) ${id}, ${login} -> ${arr}`);
    return {
      id,
      login,
      day_1: arr[0],
      day_2: arr[1],
      day_3: arr[2],
      day_4: arr[3],
      day_5: arr[4],
      day_6: arr[5],
      day_7: arr[6],
      day_8: arr[7],
      day_9: arr[8],
      day_10: arr[9],
      day_11: arr[10],
      day_12: arr[11],
      day_13: arr[12],
      day_14: arr[13],
      day_15: arr[14],
      day_16: arr[15],
      day_17: arr[16],
      day_18: arr[17],
      day_19: arr[18],
      day_20: arr[19],
      day_21: arr[20],
      day_22: arr[21],
      day_23: arr[22],
      day_24: arr[23],
      day_25: arr[24],
      day_26: arr[25],
      day_27: arr[26],
      day_28: arr[27],
      day_29: arr[28],
      day_30: arr[29],
      day_31: arr[30],
    };
  }

  async findIdByLogin(login: string): Promise<number> {
    this.logger.debug(`@findIdByLogin) ${login}`);
    return this.userService.findIdByLogin(login);
  }

  /**
   * 42 id와 로그인 id 정보를 통해 특정 년월에 클러스터에 체류한 시간을 구합니다.
   *
   * @param id
   * @param login
   * @param year
   * @param month
   * @returns UserAccumulationDayType
   */
  async getPerDaysById(
    id: number,
    login: string,
    year: number,
    month: number,
  ): Promise<UserAccumulationDayType> {
    this.logger.debug(`@getPerDaysById) ${id}, ${login}, ${year}, ${month}`);
    const date = new Date(`${year}-${month}`);
    const resultMonth = await this.tagLogService.getAllTagPerMonth(id, date);
    const dayCount = this.dateCalculator.getDaysInMonth(year, month);
    const dayArr = Array.from({ length: dayCount }, () => 0);
    for (const log of resultMonth) {
      const date = new Date(log.inTimeStamp * 1000);
      const day = date.getDate();
      dayArr[day - 1] += log.durationSecond;
    }
    return this.genDayType(id, login, dayArr);
  }

  /**
   * DB에 저장된 모든 카뎃의 월의 일별 체류시간을 구합니다.
   *
   * @param year
   * @param month
   * @returns UserAccumulationDayType[]
   */
  async getPerDaysByAll(
    year: number,
    month: number,
  ): Promise<UserAccumulationDayType[]> {
    this.logger.debug(`@getPerDaysByAll) ${year}, ${month}`);
    const cadets = await this.userService.getAllIds(false);
    return await Promise.all(
      cadets.map((cadet) =>
        this.getPerDaysById(cadet.user_id, cadet.login, year, month),
      ),
    );
  }
}
