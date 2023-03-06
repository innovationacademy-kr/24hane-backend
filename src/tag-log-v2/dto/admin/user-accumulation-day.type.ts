import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserIdType } from './user-id.type';

export class UserAccumulationDayType extends UserIdType {
  @ApiProperty({ description: '1일 누적시간 (초)', example: 42 })
  day_1: number;
  @ApiProperty({ description: '2일 누적시간 (초)', example: 42 })
  day_2: number;
  @ApiProperty({ description: '3일 누적시간 (초)', example: 42 })
  day_3: number;
  @ApiProperty({ description: '4일 누적시간 (초)', example: 42 })
  day_4: number;
  @ApiProperty({ description: '5일 누적시간 (초)', example: 42 })
  day_5: number;
  @ApiProperty({ description: '6일 누적시간 (초)', example: 42 })
  day_6: number;
  @ApiProperty({ description: '7일 누적시간 (초)', example: 42 })
  day_7: number;
  @ApiProperty({ description: '8일 누적시간 (초)', example: 42 })
  day_8: number;
  @ApiProperty({ description: '9일 누적시간 (초)', example: 42 })
  day_9: number;
  @ApiProperty({ description: '10일 누적시간 (초)', example: 42 })
  day_10: number;
  @ApiProperty({ description: '11일 누적시간 (초)', example: 42 })
  day_11: number;
  @ApiProperty({ description: '12일 누적시간 (초)', example: 42 })
  day_12: number;
  @ApiProperty({ description: '13일 누적시간 (초)', example: 42 })
  day_13: number;
  @ApiProperty({ description: '14일 누적시간 (초)', example: 42 })
  day_14: number;
  @ApiProperty({ description: '15일 누적시간 (초)', example: 42 })
  day_15: number;
  @ApiProperty({ description: '16일 누적시간 (초)', example: 42 })
  day_16: number;
  @ApiProperty({ description: '17일 누적시간 (초)', example: 42 })
  day_17: number;
  @ApiProperty({ description: '18일 누적시간 (초)', example: 42 })
  day_18: number;
  @ApiProperty({ description: '19일 누적시간 (초)', example: 42 })
  day_19: number;
  @ApiProperty({ description: '20일 누적시간 (초)', example: 42 })
  day_20: number;
  @ApiProperty({ description: '21일 누적시간 (초)', example: 42 })
  day_21: number;
  @ApiProperty({ description: '22일 누적시간 (초)', example: 42 })
  day_22: number;
  @ApiProperty({ description: '23일 누적시간 (초)', example: 42 })
  day_23: number;
  @ApiProperty({ description: '24일 누적시간 (초)', example: 42 })
  day_24: number;
  @ApiProperty({ description: '25일 누적시간 (초)', example: 42 })
  day_25: number;
  @ApiProperty({ description: '26일 누적시간 (초)', example: 42 })
  day_26: number;
  @ApiProperty({ description: '27일 누적시간 (초)', example: 42 })
  day_27: number;
  @ApiProperty({ description: '28일 누적시간 (초)', example: 42 })
  day_28: number;
  @ApiPropertyOptional({ description: '29일 누적시간 (초)', example: 42 })
  day_29?: number;
  @ApiPropertyOptional({ description: '30일 누적시간 (초)', example: 42 })
  day_30?: number;
  @ApiPropertyOptional({ description: '31일 누적시간 (초)', example: 42 })
  day_31?: number;
}
