import { ApiProperty } from '@nestjs/swagger';

export class InOutLogTypeV1 {
  @ApiProperty({
    description: '입장한 시간 (타임스탬프, 초 단위)',
    example: 1658980000,
  })
  inTimeStamp: number;

  @ApiProperty({
    description: '퇴장한 시간 (타임스탬프, 초 단위)',
    example: 1658989999,
  })
  outTimeStamp: number;

  @ApiProperty({
    description: '체류 시간 (초 단위)',
    example: 9999,
  })
  durationSecond: number;
}
