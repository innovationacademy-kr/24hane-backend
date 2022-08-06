import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserAccumulationDayType } from './dto/admin/user-accumulation-day.type';
import { IUserInfoRepository } from './repository/interface/user-info-repository.interface';

@Injectable()
export class TagLogAdminService {
  private logger = new Logger(TagLogAdminService.name);

  constructor(
    @Inject('IUserInfoRepository')
    private userInfoRepository: IUserInfoRepository,
  ) {}

  genDayType(
    id: number,
    login: string,
    arr: number[],
  ): UserAccumulationDayType {
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
    return this.userInfoRepository.findIdByLogin(login);
  }
}
