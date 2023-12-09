import { InjectRepository } from '@nestjs/typeorm';
import { PairInfo } from 'src/entities/pair-info.entity';
import { PairInfoDto } from 'src/tag-log/dto/pair-info.dto';
import { Repository } from 'typeorm';
import { IPairInfoRepository } from '../interface/pair-info-repository.interface';

export class PairInfoRepository implements IPairInfoRepository {
  constructor(
    @InjectRepository(PairInfo)
    private pairInfoRepository: Repository<PairInfo>,
  ) {}

  async findAll(): Promise<PairInfoDto[]> {
    return await this.pairInfoRepository.find();
  }

  async findInGates(): Promise<number[]> {
    const result = await this.pairInfoRepository.find();
    return result.map((col) => col.in_device);
  }

  async findOutGates(): Promise<number[]> {
    const result = await this.pairInfoRepository.find();
    return result.map((col) => col.out_device);
  }
}
