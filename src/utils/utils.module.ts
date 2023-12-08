import { Module } from '@nestjs/common';
import { DateCalculator } from './date-calculator.component';
import { GoogleApi } from './google-api.component';
import { MessageGenerator } from './message-generator.component';

@Module({
  providers: [DateCalculator, GoogleApi, MessageGenerator],
  exports: [DateCalculator, GoogleApi, MessageGenerator],
})
export class UtilsModule {}
