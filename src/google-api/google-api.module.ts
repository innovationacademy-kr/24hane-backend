import { Module } from '@nestjs/common';
import { GoogleApi } from './google-api.component';

@Module({
  providers: [GoogleApi],
  exports: [GoogleApi],
})
export class GoogleModule {}
