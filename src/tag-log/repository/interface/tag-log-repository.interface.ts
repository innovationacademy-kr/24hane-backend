import { TagLogDto } from 'src/tag-log/dto/tag-log.dto';
import { CardDto } from 'src/user/dto/card.dto';

export interface ITagLogRepository {
  /**
   * card ID들과 특정 기간에 속하는 태그 로그들을 가져옵니다.
   * (deprecated)
   *
   * @param cardIDs 카드 ID 배열
   * @param start 기간 시작
   * @param end 기간 끝
   */
  findTagLogs(cardIDs: string[], start: Date, end: Date): Promise<TagLogDto[]>;

  /**
   * 가져올 기간과 card 정보 (카드 아이디, 발급시간, 만료시간) 에 속하는 태그 로그들을 가져옵니다.
   *
   * @param cardIDs 카드 ID 배열
   * @param start 기간 시작
   * @param end 기간 끝
   */
  findTagLogsByCards(
    cards: CardDto[],
    start: Date,
    end: Date,
  ): Promise<TagLogDto[]>;

  /**
   * 특정 card ID들에 대해 가장 최신의 태그 로그를 가져옵니다. 없다면 null을 반환합니다.
   *
   * @param cards 카드 ID 배열
   */
  findLatestTagLog(cards: CardDto[]): Promise<TagLogDto | null>;

  /**
   * 특정 card ID들에 대해 가장 오래된 태그 로그를 가져옵니다. 없다면 null을 반환합니다.
   *
   * @param cards 카드 ID 배열
   */
  findFirstTagLog(cards: CardDto[]): Promise<TagLogDto | null>;

  /**
   * 특정 카드로 태그한 특정 출입태그 시간의 바로 이전 태그 로그를 가져옵니다. 없다면 null을 반환합니다.
   *
   * @param date 출입태그 시간
   * @param cardID 카드 ID
   */
  findPrevTagLog(cardID: CardDto, date: Date): Promise<TagLogDto | null>;

  /**
   * 특정 카드로 태그한 특정 출입태그 시간의 바로 다음 태그 로그를 가져옵니다. 없다면 null을 반환합니다.
   *
   * @param date 출입태그 시간
   * @param cardID 카드 ID
   */
  findNextTagLog(cardID: CardDto, date: Date): Promise<TagLogDto | null>;
}
