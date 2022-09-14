import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { UserInfoRepository } from './repository/mysql/user-info.repository';
import { UserV1Controller } from './user.v1.controller';
import { UserService } from './user.service';

const userInfoRepo = {
  provide: 'IUserInfoRepository',
  useClass: UserInfoRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo])],
  exports: [UserService],
  controllers: [UserV1Controller],
  providers: [userInfoRepo, UserService],
})
export class UserModule {}
