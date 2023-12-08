import { ApiProperty } from '@nestjs/swagger';
import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';

export class DeviceDto {
  @ApiProperty({
    description: '디바이스 ID',
    example: 13,
  })
  id: number;

  @ApiProperty({
    description: '디바이스가 위치한 캠퍼스',
    enum: Cluster,
    example: Cluster.GAEPO,
  })
  cluster: Cluster;

  @ApiProperty({
    description: '디바이스의 입실/퇴실 타입',
    type: InOut,
    example: InOut.OUT,
  })
  inoutState: InOut;
}
