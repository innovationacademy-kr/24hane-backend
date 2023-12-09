import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DateCalculatorModule } from 'src/data-calculator/data-calculator.module';
import { DeviceInfo } from 'src/entities/device-info.entity';
import { PairInfo } from 'src/entities/pair-info.entity';
import { TagLog } from 'src/entities/tag-log.entity';
import { MessageGeneratorModule } from 'src/message-generator/message-generator.module';
import { StatisticsModule } from 'src/statistics/statictics.module';
import { DeviceInfoRepository } from 'src/tag-log/repository/mysql/device-info.repository';
import { PairInfoRepository } from 'src/tag-log/repository/mysql/pair-info.repository';
import { TagLogRepository } from 'src/tag-log/repository/mysql/tag-log.repository';
import { UserModule } from 'src/user/user.module';
import { TagLogController } from './tag-log-v3.controller';
import { TagLogService } from './tag-log-v3.service';

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
    DateCalculatorModule,
    UserModule,
    MessageGeneratorModule,
    StatisticsModule,
  ],
  exports: [TypeOrmModule],
  controllers: [TagLogController],
  providers: [tagLogRepo, pairInfoRepo, deviceInfoRepo, TagLogService],
})
export class TagLogModule3 {}
