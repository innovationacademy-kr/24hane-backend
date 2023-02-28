import { CACHE_MANAGER, Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statictics.service';
import { CadetPerClusterDto } from './dto/cadet-per-cluster.dto';
import { Cache } from 'cache-manager';

@ApiTags('통계 관련 API')
@Controller({
  version: '1',
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
    let rtn: undefined | CadetPerClusterDto[] = await this.cacheManager.get(
      'getCadetPerCluster',
    );
    if (rtn === undefined) {
      rtn = await this.statisticsService.getCadetPerCluster(2);
      await this.cacheManager.set('getCadetPerCluster', rtn, 60);
    }
    return rtn;
  }
}
