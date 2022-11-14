import { Inject, Injectable, Logger } from '@nestjs/common';
import { IAuthRepository } from './repository/auth.repository.interface';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
  ) {}

  async addUserIfNotExists(user: UserSessionDto): Promise<boolean> {
    this.logger.debug(`@addUserIfNotExists) check ${user.login}`);
    const find = await this.authRepository.addUserIfNotExists(user);
    return find;
  }

  async checkUserExists(user_id: number): Promise<boolean> {
    this.logger.debug(`@addUserIfNotExists) check ${user_id}`);
    const exist = await this.authRepository.checkUserExists(user_id);
    return exist;
  }
}
