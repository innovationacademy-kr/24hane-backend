import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PairInfo } from 'src/entities/pair-info.entity';
import { TagLog } from 'src/entities/tag-log.entity';
import { UserModule } from 'src/user/user.module';
import { UtilsModule } from 'src/utils/utils.module';
import { PairInfoRepository } from './repository/mysql/pair-info.repository';
import { TagLogRepository } from './repository/mysql/tag-log.repository';
import { TagLogController } from './tag-log-v2.controller';
import { TagLogService } from './tag-log-v2.service';
import { StatisticsModule } from 'src/statistics/statictics.module';

const tagLogRepo = {
  provide: 'ITagLogRepository',
  useClass: TagLogRepository,
};

const pairInfoRepo = {
  provide: 'IPairInfoRepository',
  useClass: PairInfoRepository,
};

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TagLog, PairInfo]),
    UtilsModule,
    UserModule,
    StatisticsModule,
  ],
  exports: [TypeOrmModule],
  controllers: [TagLogController],
  providers: [tagLogRepo, pairInfoRepo, TagLogService],
})
export class TagLogModule2 {}
