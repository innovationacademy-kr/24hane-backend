import { ApiProperty } from '@nestjs/swagger';
import { UserIdType } from './user-id.type';

export class UserAccumulationMonthType extends UserIdType {
  @ApiProperty({
    description: '월별 누적시간 (초 단위)',
    example: 12345,
  })
  monthAccumationTime: number;
}
