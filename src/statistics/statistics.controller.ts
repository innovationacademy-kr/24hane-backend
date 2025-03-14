import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { CadetPerClusterDto } from './dto/cadet-per-cluster.dto';
import { StatisticsService } from './statistics.service';

@ApiTags('통계 관련 API')
@Controller({
  version: '2',
  path: 'statistics',
})
export class StatisticsController {
  private logger = new Logger(StatisticsController.name);

  constructor(
    private statisticsService: StatisticsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  /**
   * 장소별 카뎃 체류인원을 반환합니다.
   *
   * @returns CadetPerClusterDto[]
   */
  @ApiOperation({
    summary: '장소별 카뎃 체류인원 조회',
    description: '장소별 카뎃 체류인원을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: [CadetPerClusterDto],
    description: '조회 성공',
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  })
  @Get('get_cadet_per_cluster')
  async getCadetPerCluster(): Promise<CadetPerClusterDto[]> {
    this.logger.debug(`@getCadetPerCluster)`);
    // FIXME: 추후에 캐시 리팩터링 필요
    let cadetPerCluster: undefined | CadetPerClusterDto[] =
      await this.cacheManager.get('getCadetPerCluster');
    if (cadetPerCluster === undefined) {
      cadetPerCluster = await this.statisticsService.getCadetPerCluster(2);
      await this.cacheManager.set('getCadetPerCluster', cadetPerCluster, 60000);
    }
    if (cadetPerCluster.length === 0) {
      return [
        { cluster: 'GAEPO', cadet: 0 },
        { cluster: 'SEOCHO', cadet: 0 },
      ];
    }
    return cadetPerCluster;
  }
}
