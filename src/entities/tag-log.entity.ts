import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TAG_LOG')
export class TagLog {
  @PrimaryGeneratedColumn({
    name: 'IDX',
  })
  idx: number;

  @Column({
    name: 'A_TIME',
    type: 'timestamp',
  })
  a_time: number;

  @Column({
    name: 'TAG_AT',
    type: 'varchar',
    length: 15,
  })
  tag_at: string;

  @Column({
    name: 'DEVICE_ID',
    type: 'int',
  })
  device_id: number;
}
