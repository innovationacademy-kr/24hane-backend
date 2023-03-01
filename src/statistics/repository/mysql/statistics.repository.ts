import { CadetPerClusterDto } from 'src/statistics/dto/cadet-per-cluster.dto';
import { IStatisticsRepository } from '../interface/statistics.repository.interface';
import { Repository } from 'typeorm';
import { TagLog } from 'src/entities/tag-log.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class StatisticsRepository implements IStatisticsRepository {
  constructor(
    @InjectRepository(TagLog)
    private tagLogRepository: Repository<TagLog>,
  ) {}

  async getCadetPerCluster(day: number): Promise<CadetPerClusterDto[]> {
    const result = await this.tagLogRepository.manager.query(`
      SELECT DI.CAMPUS AS CAMPUS, SUM(CASE WHEN DI.IO_TYPE = 'IN' THEN 1 else 0 END) AS CNT
      FROM (SELECT TL.DEVICE_ID AS DEVICE_ID, ROW_NUMBER() OVER (PARTITION BY TL.CARD_ID ORDER BY TL.TAG_AT DESC) AS INDX
            FROM TAG_LOG TL
            WHERE TL.TAG_AT > DATE_SUB(NOW(), INTERVAL ${day} DAY)) ST
              LEFT JOIN DEVICE_INFO DI on ST.DEVICE_ID = DI.DEVICE_ID
      WHERE ST.INDX = 1
        AND DI.DEVICE_ID IS NOT NULL
      GROUP BY DI.CAMPUS
    `);
    return result.map((val) => ({ cluster: val.CAMPUS, cadet: val.CNT }));
  }
  ///
}
