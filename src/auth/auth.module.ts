import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { GoogleApiModule } from 'src/utils/google-api/google-api.module';
import { Auth42Controller } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthAdminStrategy } from './srategy/auth.admin.strategy';
import { AuthExternalStrategy } from './srategy/auth.external.strategy';
import { AuthStrategy } from './srategy/auth.strategy';
import { FtOAuthStrategy } from './srategy/ft-oauth.strategy';

const repo = {
  provide: 'IAuthRepository',
  useClass: AuthRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    GoogleApiModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('jwt.expiresIn'),
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
    AuthExternalStrategy,
    AuthService,
    repo,
  ],
  exports: [AuthService],
})
export class AuthModule {}
