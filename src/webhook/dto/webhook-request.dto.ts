import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';

export class WebhookRequestDto {
  @ApiProperty({
    description: '입/퇴실 발생 시간',
    example: new Date(),
  })
  @IsDateString()
  timestamp: Date;

  @ApiPropertyOptional({
    description: '클러스터 위치 (현재 Optional)',
    enum: ['GAEPO', 'SEOCHO'],
  })
  @IsOptional()
  @IsEnum(Cluster)
  cluster?: Cluster;

  @ApiProperty({
    description: '인트라 ID',
    example: 'joopark',
  })
  @IsString()
  intraId: string;

  @ApiProperty({
    description: '입/퇴실 여부',
    enum: ['IN', 'OUT'],
  })
  @IsEnum(InOut)
  inout: InOut;
}
