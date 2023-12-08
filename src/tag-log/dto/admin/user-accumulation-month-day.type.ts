import { ApiProperty } from '@nestjs/swagger';
import { UserAccumulationDayType } from './user-accumulation-day.type';

export class UserAccumulationMonthDayType extends UserAccumulationDayType {
  @ApiProperty({
    description: '월별 누적시간 (초 단위)',
    example: 12345,
  })
  monthAccumationTime: number;
}
