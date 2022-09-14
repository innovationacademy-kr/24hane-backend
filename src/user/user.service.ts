import { Inject, Injectable, Logger } from '@nestjs/common';
import { IdLoginDto } from './dto/id-login.dto';
import { IUserInfoRepository } from './repository/interface/user-info-repository.interface';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserInfoRepository')
    private userInfoRepository: IUserInfoRepository,
  ) {}

  /**
   * 사용자 ID로 사용자에 대한 카드 ID 목록을 반환합니다.
   *
   * @param userId 사용자 아이디
   * @param vaildEnd 최소 만료기간 (optional)
   * @param vaildStart 카드 발급한 기간보다 작은 기간 (optional)
   * @returns 카드 ID 목록 (배열)
   */
  async findCardIds(
    userId: number,
    vaildEnd?: Date,
    vaildStart?: Date,
  ): Promise<string[]> {
    return await this.userInfoRepository.findCardIds(
      userId,
      vaildEnd,
      vaildStart,
    );
  }

  /**
   * 사용자 로그인 ID로 사용자의 ID를 반환합니다. 존재하지 않는 로그인 ID면 -1을 리턴합니다
   *
   * @param login 로그인 ID
   * @return 42 ID
   */
  async findIdByLogin(login: string): Promise<number> {
    return await this.userInfoRepository.findIdByLogin(login);
  }

  /**
   * DB에 저장된 모든 ID를 리턴합니다.
   *
   * @param admin true: 관리자만, false: 카뎃만, undefined: 모두
   */
  async getAllIds(admin?: boolean): Promise<IdLoginDto[]> {
    return await this.userInfoRepository.getAllIds(admin);
  }
}
