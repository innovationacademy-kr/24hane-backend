import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { ReissueController } from './reissue.controller';
import { ReissueService } from './reissue.service';
import { CardReissueRepository } from './repository/googleApi/card-reissue.repository';
import { UserCardRepository } from './repository/mysql/user-card-no.repository';

const userCardRepo = {
  provide: 'IUserCardRepository',
  useClass: UserCardRepository,
};

const cardReissueRepo = {
  provide: 'ICardReissueRepository',
  useClass: CardReissueRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo])],
  exports: [ReissueService],
  controllers: [ReissueController],
  providers: [userCardRepo, cardReissueRepo, ReissueService],
})
export class ReissueModule {}
