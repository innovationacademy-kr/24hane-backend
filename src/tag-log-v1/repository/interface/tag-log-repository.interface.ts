import { TagLogDto } from 'src/tag-log-v1/dto/tag-log.dto';

export interface ITagLogRepository {
  /**
   * card ID들과 특정 기간에 속하는 태그 로그들을 가져옵니다.
   *
   * @param cardIDs 카드 ID 배열
   * @param start 기간 시작
   * @param end 기간 끝
   */
  findTagLogs(cardIDs: string[], start: Date, end: Date): Promise<TagLogDto[]>;
}
