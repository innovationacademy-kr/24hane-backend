import { IdLoginDto } from 'src/tag-log-v1/dto/id-login.dto';

export interface IUserInfoRepository {
  /**
   * 사용자 ID로 사용자에 대한 카드 ID 목록을 반환합니다.
   *
   * @param userId 사용자 아이디
   * @param vaildEnd 최소 만료기간 (optional)
   * @param vaildStart 카드 발급한 기간보다 작은 기간 (optional)
   * @returns 카드 ID 목록 (배열)
   */
  findCardIds(
    userId: number,
    vaildEnd?: Date,
    vaildStart?: Date,
  ): Promise<string[]>;

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
}
