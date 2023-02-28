import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsRepository } from './repository/mysql/statistics.repository';
import { StatisticsService } from './statictics.service';
import { StatisticsController } from './statictics.controller';
import { TagLog } from 'src/entities/tag-log.entity';

const statisticsRepo = {
  provide: 'IStatisticsRepository',
  useClass: StatisticsRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TagLog])],
  controllers: [StatisticsController],
  providers: [statisticsRepo, StatisticsService],
})
export class StatisticsModule {}
