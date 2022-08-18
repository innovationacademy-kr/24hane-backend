import { Module } from '@nestjs/common';
import { UtilsModule } from 'src/utils/utils.module';
import { FtSessionSerializer } from './42/ft.session.serializer';
import { FtStrategy } from './42/ft.strategy';
import { Auth42Controller } from './auth.controller';

@Module({
  providers: [FtSessionSerializer, FtStrategy],
  imports: [UtilsModule],
  controllers: [Auth42Controller],
})
export class AuthModule {}
