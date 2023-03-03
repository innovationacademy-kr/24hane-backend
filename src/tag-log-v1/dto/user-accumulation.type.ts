import { ApiProperty } from '@nestjs/swagger';

export class UserAccumulationType {
  @ApiProperty({
    description: '일별 누적시간',
    example: 12345,
  })
  todayAccumationTime: number;

  @ApiProperty({
    description: '월별 누적시간',
    example: 12345,
  })
  monthAccumationTime: number;
}
