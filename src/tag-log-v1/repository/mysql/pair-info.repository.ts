import { InjectRepository } from '@nestjs/typeorm';
import { PairInfoDto } from 'src/tag-log-v1/dto/pair-info.dto';
import { IPairInfoRepository } from '../interface/pair-info-repository.interface';
import { Repository } from 'typeorm';
import { PairInfo } from 'src/entities/pair-info.entity';

export class PairInfoRepository implements IPairInfoRepository {
  constructor(
    @InjectRepository(PairInfo)
    private pairInfoRepository: Repository<PairInfo>,
  ) {}

  async findAll(): Promise<PairInfoDto[]> {
    return await this.pairInfoRepository.find();
  }
}
