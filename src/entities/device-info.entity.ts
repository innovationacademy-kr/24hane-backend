import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('DEVICE_INFO')
export class DeviceInfo {
  @PrimaryColumn({
    name: 'DEVICE_ID',
    type: 'int',
  })
  device_id: number;

  @Column({
    name: 'CAMPUS',
    type: 'varchar',
    length: 15,
  })
  campus: Cluster;

  @Column({
    name: 'IO_TYPE',
    type: 'varchar',
    length: 3,
  })
  io_type: InOut;
}
