import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './configs/configuration';
import TypeOrmConfigService from './configs/typeorm.config';
import { ExtModule } from './ext/ext.module';
import { SessionMiddleware } from './middleware/session-middleware';
import { TagLogModule } from './tag-log-v1/tag-log.module';
import { UserModule } from './user/user.module';
//import { UsageModule } from './usage/usage.module';
//import { WebhookModule } from './webhook/webhook.module';
import { ReissueModule } from './reissue/reissue.module';

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
    AuthModule,
    TagLogModule,
    UserModule,
    ExtModule,
    ReissueModule,
  ],
  providers: [SessionMiddleware],
  // controllers: [ReissueController],
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
