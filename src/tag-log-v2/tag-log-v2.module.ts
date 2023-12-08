import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DeviceInfo } from 'src/entities/device-info.entity';
import { PairInfo } from 'src/entities/pair-info.entity';
import { TagLog } from 'src/entities/tag-log.entity';
import { StatisticsModule } from 'src/statistics/statictics.module';
import { PairInfoRepository } from 'src/tag-log/repository/mysql/pair-info.repository';
import { UserModule } from 'src/user/user.module';
import { UtilsModule } from 'src/utils/utils.module';
import { Cabi42Controller } from '../ext/cabi42.controller';
import { DeviceInfoRepository } from '../tag-log/repository/mysql/device-info.repository';
import { TagLogRepository } from '../tag-log/repository/mysql/tag-log.repository';
import { TagLogAdminService } from './tag-log-v2-admin.service';
import { TagLogAdminController } from './tag-log-admin.controller';
import { TagLogController } from './tag-log-v2.controller';
import { TagLogService } from './tag-log-v2.service';

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
    AuthModule,
    TypeOrmModule.forFeature([TagLog, PairInfo, DeviceInfo]),
    UtilsModule,
    UserModule,
    StatisticsModule,
  ],
  exports: [TypeOrmModule],
  controllers: [TagLogController, TagLogAdminController, Cabi42Controller],
  providers: [
    tagLogRepo,
    pairInfoRepo,
    deviceInfoRepo,
    TagLogService,
    TagLogAdminService,
  ],
})
export class TagLogModule2 {}
