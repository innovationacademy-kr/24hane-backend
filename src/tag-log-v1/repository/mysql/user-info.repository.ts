import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { IUserInfoRepository } from '../interface/user-info-repository.interface';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

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
}
