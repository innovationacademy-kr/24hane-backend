import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/auth/dto/user.dto';
import { UserInfo } from 'src/entities/user-info.entity';
import { Repository } from 'typeorm';
import { IAuthRepository } from './auth.repository.interface';

export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async addUserIfNotExists(user: UserDto): Promise<boolean> {
    const find = await this.userInfoRepository.findOne({
      where: {
        user_id: user.user_id,
      },
    });
    if (!find) {
      await this.userInfoRepository.save({
        user_id: user.user_id,
        login: user.login,
        is_admin: user.is_staff,
      });
      return false;
    }
    return true;
  }

  async checkUserExists(user_id: number): Promise<boolean> {
    const result = await this.userInfoRepository
      .createQueryBuilder('u')
      .select(['u.user_id'])
      .where('u.user_id = :user_id', { user_id })
      .execute();
    return result.length !== 0;
  }
}
