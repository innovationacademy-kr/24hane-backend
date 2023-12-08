import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInfo } from 'src/entities/device-info.entity';
import { TagLog } from 'src/entities/tag-log.entity';
import { TagLogRepository } from 'src/tag-log-v1/repository/mysql/tag-log.repository';
import { UserModule } from 'src/user/user.module';
import { ExtService } from './ext.service';
import { DeviceInfoRepository } from './repository/mysql/device-info.repository';
import { Where42Controller } from './where42.controller';

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
  imports: [UserModule, TypeOrmModule.forFeature([DeviceInfo, TagLog])],
  controllers: [Where42Controller],
  providers: [tagLogRepo, deviceInfoRepo, ExtService],
})
export class ExtModule {}
