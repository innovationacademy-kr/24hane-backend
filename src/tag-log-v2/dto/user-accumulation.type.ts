import { ApiProperty } from '@nestjs/swagger';

export class UserAccumulationType {
  @ApiProperty({
    description: '일별 누적시간',
    example: 12345,
  })
  todayAccumulationTime: number;

  @ApiProperty({
    description: '월별 누적시간',
    example: 12345,
  })
  monthAccumulationTime: number;

  @ApiProperty({
    description: '최근 6주간의 누적시간',
    example: [1234, 5678, 9012, 3456, 7890, 1234],
  })
  sixWeekAccumulationTime: number[];
  
  @ApiProperty({
    description: '최근 6개월간의 누적시간',
    example: [12345, 67890, 12345, 67890, 12345, 67890],
  })
  sixMonthAccumulationTime: number[];
}
