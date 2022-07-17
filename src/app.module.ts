import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './configs/configuration';
import TypeOrmConfigService from './configs/typeorm.config';
import { SessionMiddleware } from './session-middleware';
import { UsageModule } from './usage/usage.module';
import { WebhookModule } from './webhook/webhook.module';

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
    WebhookModule,
    UsageModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, SessionMiddleware],
})
export class AppModule implements NestModule {
  constructor(public sessionMiddleware: SessionMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.sessionMiddleware.expressSession,
        this.sessionMiddleware.passportInit,
        this.sessionMiddleware.passportSession,
      )
      .forRoutes('*');
  }
}
