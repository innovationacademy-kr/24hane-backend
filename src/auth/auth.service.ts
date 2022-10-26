import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from './repository/auth.repository.interface';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
  ) {}

  async addUserIfNotExists(user: UserSessionDto): Promise<boolean> {
    const find = await this.authRepository.addUserIfNotExists(user);
    return find;
  }

  async checkUserExists(user_id: number): Promise<boolean> {
    const exist = await this.authRepository.checkUserExists(user_id);
    return exist;
  }
}
