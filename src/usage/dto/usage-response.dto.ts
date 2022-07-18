import { ApiProperty } from '@nestjs/swagger';
import InOut from 'src/enums/inout.enum';

export class UsageResponseDto {
  @ApiProperty({
    description: '인트라 ID',
    example: 'joopark',
  })
  userId: string;

  @ApiProperty({
    description: '인트라 이미지 URI',
    example: 'https://cdn.intra.42.fr/users/joopark.jpg',
  })
  profile: string;

  @ApiProperty({
    description: '현재 입/퇴실 여부',
    enum: ['IN', 'OUT'],
  })
  state: InOut;

  /*
  @ApiProperty({
    description: '마지막 입실 시간',
    example: new Date(),
  })
  lastCheckInAt: Date;
  */

  @ApiProperty({
    description: '클러스터 체류시간 (초 단위)',
    example: 3600,
  })
  durationTime: number;

  @ApiProperty({
    description: '누적 시간의 기준이 되는 시작 시간',
    example: new Date(),
  })
  fromDate: Date;

  @ApiProperty({
    description: '누적 시간의 기준이 되는 끝 시간',
    example: new Date(),
  })
  toDate: Date;
}
