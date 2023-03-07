import { Module } from '@nestjs/common';
import { ReissueService } from './reissue.service';
import { ReissueController } from './reissue.controller';
import { UserCardRepository } from './repository/mysql/user-card-no.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { CardReissueRepository } from './repository/googleApi/card-reissue.repository';

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
