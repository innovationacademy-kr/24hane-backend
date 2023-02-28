import { Module } from '@nestjs/common';
import { ReissueService } from './reissue.service';
import { ReissueController } from './reissue.controller';
import { UserCardRepository } from './repository/mysql/user-card-no.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { GoogleSpreadSheetApi } from './googleAuth.component';

const userCardRepo = {
  provide: 'IUserCardRepository',
  useClass: UserCardRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo])],
  exports: [ReissueService],
  controllers: [ReissueController],
  providers: [userCardRepo, ReissueService, GoogleSpreadSheetApi],
})
export class ReissueModule {}
