export interface IUserCardRepository {
  /**
   * @param user_id 사용자 아이디
   */
  findInitialCardByUserId(user_id: number): Promise<string[]>;
}
