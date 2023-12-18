import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInfo } from 'src/entities/device-info.entity';
import { PairInfo } from 'src/entities/pair-info.entity';
import { TagLog } from 'src/entities/tag-log.entity';
import { StatisticsModule } from 'src/statistics/statictics.module';
import { UserModule } from 'src/user/user.module';
import { DateCalculatorModule } from 'src/utils/data-calculator/data-calculator.module';
import { DeviceInfoRepository } from './repository/mysql/device-info.repository';
import { PairInfoRepository } from './repository/mysql/pair-info.repository';
import { TagLogRepository } from './repository/mysql/tag-log.repository';
import { TagLogAdminController } from './tag-log-admin.controller';
import { TagLogAdminService } from './tag-log-admin.service';
import { TagLogController } from './tag-log.controller';
import { TagLogService } from './tag-log.service';

const tagLogRepo = {
  provide: 'ITagLogRepository',
  useClass: TagLogRepository,
};

const pairInfoRepo = {
  provide: 'IPairInfoRepository',
  useClass: PairInfoRepository,
};

const deviceInfoRepo = {
  provide: 'IDeviceInfoRepository',
  useClass: DeviceInfoRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TagLog, PairInfo, DeviceInfo]),
    DateCalculatorModule,
    UserModule,
    StatisticsModule,
  ],
  exports: [TypeOrmModule, TagLogService, TagLogAdminService],
  controllers: [TagLogController, TagLogAdminController],
  providers: [
    tagLogRepo,
    pairInfoRepo,
    deviceInfoRepo,
    TagLogService,
    TagLogAdminService,
  ],
})
export class TagLogModule {}
