import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CadetPerClusterDto } from './dto/cadet-per-cluster.dto';
import { IStatisticsRepository } from './repository/interface/statistics.repository.interface';

@Injectable()
export class StatisticsService {
  private logger = new Logger(StatisticsService.name);

  constructor(
    @Inject('IStatisticsRepository')
    private statisticsRepository: IStatisticsRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * 현재시간 기준 클러스터 당 카뎃의 체류인원을 가져옴.
   * @param day 현재시간 뒤로 day일 만큼의 기록만 산정함.
   */
  async getCadetPerCluster(day: number): Promise<CadetPerClusterDto[]> {
    this.logger.debug(`@getCadetPerCluster) in day: ${day}`);
    // FIXME: 추후에 캐시 관련 리팩터링 필요
    let cadetPerCluster: undefined | CadetPerClusterDto[] =
      await this.cacheManager.get('getCadetPerCluster');
    if (cadetPerCluster === undefined) {
      cadetPerCluster = await this.statisticsRepository.getCadetPerCluster(day);
      await this.cacheManager.set('getCadetPerCluster', cadetPerCluster, 60000);
    }
    return cadetPerCluster;
  }
}
