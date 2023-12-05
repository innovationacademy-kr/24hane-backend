import { Module } from "@nestjs/common";
import { DeviceInfoRepository } from "./repository/mysql/device-info.repository";
import { PairInfoRepository } from "./repository/mysql/pair-info.repository";
import { TagLogRepository } from "./repository/mysql/tag-log.repository";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UtilsModule } from "src/utils/utils.module";
import { StatisticsModule } from "src/statistics/statictics.module";
import { UserModule } from "src/user/user.module";
import { TagLog } from "src/entities/tag-log.entity";
import { PairInfo } from "src/entities/pair-info.entity";
import { DeviceInfo } from "src/entities/device-info.entity";
import { TagLogController } from "./tag-log-v3.controller";
import { TagLogService } from "./tag-log-v3.service";


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
  controllers: [TagLogController],
  providers: [
    tagLogRepo,
    pairInfoRepo,
    deviceInfoRepo,
    TagLogService,
  ],
})
export class TagLogModule3 {}
