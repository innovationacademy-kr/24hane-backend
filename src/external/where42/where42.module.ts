import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInfo } from 'src/entities/device-info.entity';
import { TagLog } from 'src/entities/tag-log.entity';
import { TagLogRepository } from 'src/tag-log/repository/mysql/tag-log.repository';
import { UserModule } from 'src/user/user.module';
import { DateCalculatorModule } from 'src/utils/data-calculator/data-calculator.module';
import { DeviceInfoRepository } from './repository/mysql/device-info.repository';
import { Where42Controller } from './where42.controller';
import { Where42Service } from './where42.service';

const tagLogRepo = {
  provide: 'ITagLogRepository',
  useClass: TagLogRepository,
};

const deviceInfoRepo = {
  provide: 'IDeviceInfoRepository',
  useClass: DeviceInfoRepository,
};

/**
 * 24Hane 기능 외 다른 서비스에서 사용하는 외부 API 모듈
 */
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([DeviceInfo, TagLog]),
    DateCalculatorModule,
  ],
  controllers: [Where42Controller],
  providers: [tagLogRepo, deviceInfoRepo, Where42Service],
})
export class Where42Module {}
