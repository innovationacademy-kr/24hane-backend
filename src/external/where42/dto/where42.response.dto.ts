import { ApiProperty } from '@nestjs/swagger';
import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';

export class Where42ResponseDto {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string;

  @ApiProperty({
    description: '클러스터 체류 여부',
    enum: InOut,
    example: InOut.OUT,
  })
  inoutState: InOut;

  @ApiProperty({
    description: '체류중인 클러스터',
    enum: Cluster,
    example: Cluster.GAEPO,
  })
  cluster: Cluster;
}

export class Where42RequestDto {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'yeju',
  })
  login: string;
}
