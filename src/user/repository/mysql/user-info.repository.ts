import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { IUserInfoRepository } from '../interface/user-info-repository.interface';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { IdLoginDto } from 'src/user/dto/id-login.dto';
import { CardDto } from 'src/user/dto/card.dto';

export class UserInfoRepository implements IUserInfoRepository {
  constructor(
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async findCardsByUserId(
    id: number,
    begin?: Date,
    end?: Date,
  ): Promise<CardDto[]> {
    const end_use = begin ? MoreThanOrEqual(begin) : undefined;
    const start_use = end ? LessThanOrEqual(end) : undefined;
    const result = await this.userInfoRepository.findOne({
      relations: {
        cardIssuance: true,
      },
      where: {
        user_id: id,
        cardIssuance: {
          end_use,
          start_use,
        },
      },
    });
    if (!result) {
      return [];
    }
    return result.cardIssuance.map((card) => ({
      card_id: card.card_id,
      begin: card.start_use,
      end: card.end_use,
    }));
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
