import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './configs/configuration';
import TypeOrmConfigService from './configs/typeorm.config';
import { SessionMiddleware } from './middleware/session-middleware';
import { TagLogAdminController } from './tag-log-v1/tag-log-admin.controller';
import { TagLogModule } from './tag-log-v1/tag-log.module';
import { UserModule } from './user/user.module';
//import { UsageModule } from './usage/usage.module';
//import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    //WebhookModule, -> deprecated
    //UsageModule, -> deprecated
    AuthModule,
    TagLogModule,
    UserModule,
  ],
  providers: [SessionMiddleware],
})
export class AppModule implements NestModule {
  constructor(public sessionMiddleware: SessionMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.sessionMiddleware.cookieParser,
        this.sessionMiddleware.expressSession,
        this.sessionMiddleware.passportInit,
        this.sessionMiddleware.passportSession,
      )
      .forRoutes('*');
    // 관리자 API에만 세션을 쿼리로 삽입하는 미들웨어 적용
    consumer
      .apply(this.sessionMiddleware.sessionByQuery)
      .forRoutes('*/admin/*');
    // 쿼리의 리다이렉트 경로를 쿠키로 설정하는 미들웨어
    consumer
      .apply(this.sessionMiddleware.SetRedirectMiddleware)
      .forRoutes('*/user/login/42');
  }
}
