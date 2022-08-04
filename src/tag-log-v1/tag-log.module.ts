import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairInfo } from 'src/entities/pair-info.entity';
import { TagLog } from 'src/entities/tag-log.entity';
import { UserInfo } from 'src/entities/user-info.entity';
import { PairInfoRepository } from './repository/mysql/pair-info.repository';
import { TagLogRepository } from './repository/mysql/tag-log.repository';
import { UserInfoRepository } from './repository/mysql/user-info.repository';
import { TagLogController } from './tag-log.controller';
import { TagLogService } from './tag-log.service';

const userInfoRepo = {
  provide: 'IUserInfoRepository',
  useClass: UserInfoRepository,
};

const tagLogRepo = {
  provide: 'ITagLogRepository',
  useClass: TagLogRepository,
};

const pairInfoRepo = {
  provide: 'IPairInfoRepository',
  useClass: PairInfoRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TagLog, UserInfo, PairInfo])],
  exports: [TypeOrmModule],
  controllers: [TagLogController],
  providers: [userInfoRepo, tagLogRepo, pairInfoRepo, TagLogService],
})
export class TagLogModule {}
