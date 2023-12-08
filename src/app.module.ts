import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './configs/configuration';
import TypeOrmConfigService from './configs/typeorm.config';
import { Cabi42Module } from './external/cabi42/cabi42.module';
import { Where42Module } from './external/where42/where42.module';
import { SessionMiddleware } from './middleware/session-middleware';
import { RedirectModule } from './redirect/redirect.module';
import { ReissueModule } from './reissue/reissue.module';
import { StatisticsModule } from './statistics/statictics.module';
import { TagLogModule } from './tag-log-v1/tag-log.module';
import { TagLogModule2 } from './tag-log-v2/tag-log-v2.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    StatisticsModule,
    RedirectModule,
    AuthModule,
    TagLogModule,
    TagLogModule2,
    UserModule,
    Where42Module,
    Cabi42Module,
    ReissueModule,
  ],
  providers: [SessionMiddleware],
})
export class AppModule implements NestModule {
  constructor(public sessionMiddleware: SessionMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.sessionMiddleware.cookieParser).forRoutes('*');
    // 쿼리의 리다이렉트 경로를 쿠키로 설정하는 미들웨어
    consumer
      .apply(this.sessionMiddleware.SetRedirectMiddleware)
      .forRoutes('/user/login/42');
  }
}
