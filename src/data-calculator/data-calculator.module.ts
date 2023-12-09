import { Module } from '@nestjs/common';
import { DateCalculator } from './date-calculator.component';

@Module({
  providers: [DateCalculator],
  exports: [DateCalculator],
})
export class DateCalculatorModule {}
