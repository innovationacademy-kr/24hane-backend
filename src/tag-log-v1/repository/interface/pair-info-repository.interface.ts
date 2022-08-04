import { PairInfoDto } from 'src/tag-log-v1/dto/pair-info.dto';

export interface IPairInfoRepository {
  findAll(): Promise<PairInfoDto[]>;
}
