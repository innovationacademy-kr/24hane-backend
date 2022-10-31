import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { Auth42Controller } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthAdminStrategy } from './srategy/auth.admin.strategy';
import { AuthStrategy } from './srategy/auth.strategy';
import { FtOAuthStrategy } from './srategy/ft-oauth.strategy';

const repo = {
  provide: 'IAuthRepository',
  useClass: AuthRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    UtilsModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [Auth42Controller],
  providers: [
    FtOAuthStrategy,
    AuthStrategy,
    AuthAdminStrategy,
    AuthService,
    repo,
  ],
  exports: [AuthService],
})
export class AuthModule {}
