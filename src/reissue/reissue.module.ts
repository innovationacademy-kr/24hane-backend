import { Module } from '@nestjs/common';
import { ReissueService } from './reissue.service';
import { ReissueController } from './reissue.controller';
import { UserCardRepository } from './repository/mysql/user-card-no.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { UtilsModule } from 'src/utils/utils.module';

const userCardRepo = {
  provide: 'IUserCardRepository',
  useClass: UserCardRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]), UtilsModule],
  exports: [ReissueService],
  controllers: [ReissueController],
  providers: [userCardRepo, ReissueService],
})
export class ReissueModule {}
