import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagLog } from 'src/entities/tag-log.entity';
import { StatisticsRepository } from './repository/mysql/statistics.repository';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

const statisticsRepo = {
  provide: 'IStatisticsRepository',
  useClass: StatisticsRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TagLog])],
  exports: [StatisticsService],
  controllers: [StatisticsController],
  providers: [statisticsRepo, StatisticsService],
})
export class StatisticsModule {}
