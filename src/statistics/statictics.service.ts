import { Inject, Injectable, Logger } from '@nestjs/common';
import { IStatisticsRepository } from './repository/interface/statistics.repository.interface';
import { CadetPerClusterDto } from './dto/cadet-per-cluster.dto';

@Injectable()
export class StatisticsService {
  private logger = new Logger(StatisticsService.name);

  constructor(
    @Inject('IStatisticsRepository')
    private statisticsRepository: IStatisticsRepository,
  ) {}

  /**
   * 현재시간 기준 클러스터 당 카뎃의 체류인원을 가져옴.
   * @param day 현재시간 뒤로 day일 만큼의 기록만 산정함.
   */
  async getCadetPerCluster(day: number): Promise<CadetPerClusterDto[]> {
    return this.statisticsRepository.getCadetPerCluster(day);
  }
}
