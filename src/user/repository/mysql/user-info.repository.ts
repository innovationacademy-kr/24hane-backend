import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { IUserInfoRepository } from '../interface/user-info-repository.interface';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { IdLoginDto } from 'src/user/dto/id-login.dto';

export class UserInfoRepository implements IUserInfoRepository {
  constructor(
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async findCardIds(
    userId: number,
    vaildEnd?: Date,
    vaildStart?: Date,
  ): Promise<string[]> {
    const end = vaildEnd ? MoreThanOrEqual(vaildEnd) : undefined;
    const start = vaildStart ? LessThanOrEqual(vaildStart) : undefined;
    const result = await this.userInfoRepository.findOne({
      relations: {
        cardIssuance: true,
      },
      where: {
        user_id: userId,
        cardIssuance: {
          end_use: end,
          start_use: start,
        },
      },
    });
    if (!result) {
      return [];
    }
    return result.cardIssuance.map((c) => c.card_id);
  }

  async findIdByLogin(login: string): Promise<number> {
    const result = await this.userInfoRepository.findOne({
      where: {
        login,
      },
    });
    if (!result) {
      return -1;
    }
    return result.user_id;
  }

  async getAllIds(admin?: boolean): Promise<IdLoginDto[]> {
    let obj = undefined;
    if (admin) {
      obj = {
        is_admin: admin,
      };
    }
    const result = await this.userInfoRepository.find({
      where: obj,
    });
    return result.map((r) => ({
      user_id: r.user_id,
      login: r.login,
    }));
  }
}
