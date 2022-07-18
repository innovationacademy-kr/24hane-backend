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
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
      entities: [`${__dirname}/../**/entities/*.entity.{js,ts}`],
      logging: this.configService.get('log'),
      charset: 'utf8mb4_general_ci',
      timezone: '+09:00',
      // cache: true, TODO: 추후에 캐시 전략 구상할 때 사용 예정
    };
  }
}
