import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PAIR_INFO')
export class PairInfo {
  @PrimaryGeneratedColumn({
    name: 'IDX',
  })
  idx: number;

  @Column({
    name: 'IN_DEVICE',
    type: 'int',
  })
  in_device: number;

  @Column({
    name: 'OUT_DEVICE',
    type: 'int',
  })
  out_device: number;
}
