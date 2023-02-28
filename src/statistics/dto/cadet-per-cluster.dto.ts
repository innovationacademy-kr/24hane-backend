import { ApiProperty } from '@nestjs/swagger';

export class CadetPerClusterDto {
  @ApiProperty({
    description: '클러스터',
    example: 'GAEPO',
  })
  cluster: string;

  @ApiProperty({
    description: '입장 인원 수',
    example: 42,
  })
  cadet: number;
}
