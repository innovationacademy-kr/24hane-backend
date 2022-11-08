import { Inject, Injectable, Logger } from '@nestjs/common';
import { CardDto } from './dto/card.dto';
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
   * 발급일과 만료일 내의 카드 발급 기록을 가지고 옵니다.
   * begin <= 카드의_만료_시간 && end >= 카드의_발급_시간 관계를 이용합니다.
   *
   * @param id 사용자 아이디
   * @param begin 발급일 (optional)
   * @param end 만료일 (optional)
   * @returns 카드 ID 목록 (배열)
   */
  async findCardsByUserId(
    id: number,
    begin?: Date,
    end?: Date,
  ): Promise<CardDto[]> {
    return await this.userInfoRepository.findCardsByUserId(id, begin, end);
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
