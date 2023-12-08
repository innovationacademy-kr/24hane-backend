import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagLog } from 'src/entities/tag-log.entity';
import { TagLogRepository } from 'src/tag-log-v1/repository/mysql/tag-log.repository';
import { TagLogModule2 } from 'src/tag-log-v2/tag-log-v2.module';
import { UserModule } from 'src/user/user.module';
import { Cabi42Controller } from './cabi42.controller';
import { Cabi42Service } from './cabi42.service';

const tagLogRepo = {
  provide: 'ITagLogRepository',
  useClass: TagLogRepository,
};

/**
 * 24Hane 기능 외 다른 서비스에서 사용하는 외부 API 모듈
 */
@Module({
  imports: [UserModule, TagLogModule2, TypeOrmModule.forFeature([TagLog])],
  controllers: [Cabi42Controller],
  providers: [tagLogRepo, Cabi42Service],
})
export class Cabi42Module {}
