import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export default class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    // or typeorm.config.ts
    return {
      type: 'mysql',
      host: this.configService.getOrThrow<string>('database.host'),
      port: this.configService.getOrThrow<number>('database.port'),
      username: this.configService.getOrThrow<string>('database.username'),
      password: this.configService.getOrThrow<string>('database.password'),
      database: this.configService.getOrThrow<string>('database.database'),
      entities: [`${__dirname}/../**/entities/*.entity.{js,ts}`],
      logging: this.configService.getOrThrow<boolean>('log'),
      charset: 'utf8mb4_general_ci',
      timezone: '+09:00',
      // cache: true, TODO: 추후에 캐시 전략 구상할 때 사용 예정
    };
  }
}
