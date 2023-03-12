import { CardReissue } from 'src/entities/card-reissue.entity';

export interface ICardReissueRepository {
  /**
   * 특정 유저에 대한 카드 발급 현황을 가지고 옵니다.
   *
   * @param user_id 사용자 아이디에 해당하는 row 반환
   */
  findByUserId(user_id: number): Promise<CardReissue[]>;

  /**
   * 1개의 row를 추가 또는 업데이트합니다.
   *
   * @param data 하나의 row 추가 또는 업데이트
   */
  save(data: CardReissue): Promise<void>;
}
