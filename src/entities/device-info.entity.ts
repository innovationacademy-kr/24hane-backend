import { Entity, Column, PrimaryColumn } from 'typeorm';

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
  campus: string;

  @Column({
    name: 'IO_TYPE',
    type: 'varchar',
    length: 3,
  })
  io_type: string;
}
