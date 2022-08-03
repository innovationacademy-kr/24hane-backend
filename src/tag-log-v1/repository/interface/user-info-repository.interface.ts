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
}
