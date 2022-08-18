import { Module } from '@nestjs/common';
import { DateCalculator } from './date-calculator.component';
import { GoogleApi } from './google-api.component';

@Module({
  providers: [DateCalculator, GoogleApi],
  exports: [DateCalculator, GoogleApi],
})
export class UtilsModule {}
