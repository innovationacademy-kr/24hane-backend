import { PairInfoDto } from 'src/tag-log-v1/dto/pair-info.dto';

export interface IPairInfoRepository {
  /**
   * 모든 입출입 게이트 쌍을 반환합니다.
   */
  findAll(): Promise<PairInfoDto[]>;

  /**
   * 모든 입장 게이트를 반환합니다.
   */
  findInGates(): Promise<number[]>;

  /**
   * 모든 퇴장 게이트를 반환합니다.
   */
  findOutGates(): Promise<number[]>;
}
