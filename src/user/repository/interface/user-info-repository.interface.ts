import { CardDto } from 'src/user/dto/card.dto';
import { IdLoginDto } from 'src/user/dto/id-login.dto';

export interface IUserInfoRepository {
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
  findCardsByUserId(id: number, begin?: Date, end?: Date): Promise<CardDto[]>;

  /**
   * 사용자 로그인 ID로 사용자의 ID를 반환합니다. 존재하지 않는 로그인 ID면 -1을 리턴합니다
   *
   * @param login 로그인 ID
   * @return 42 ID
   */
  findIdByLogin(login: string): Promise<number>;

  /**
   * DB에 저장된 모든 ID를 리턴합니다.
   *
   * @param admin true: 관리자만, false: 카뎃만, undefined: 모두
   */
  getAllIds(admin?: boolean): Promise<IdLoginDto[]>;

  /**
   * 로그인 ID 배열에 해당하는 사용자 정보를 반환합니다.
   *
   * @param logins 로그인 ID 배열
   * @returns 사용자 정보 배열
   */
  findUsersByLogins(logins: string[]): Promise<IdLoginDto[]>;
}
