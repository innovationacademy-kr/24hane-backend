import { Entity, PrimaryColumn } from 'typeorm';

@Entity('PAIR_INFO')
export class PairInfo {
  @PrimaryColumn({
    name: 'IN_DEVICE',
    type: 'int',
  })
  in_device: number;

  @PrimaryColumn({
    name: 'OUT_DEVICE',
    type: 'int',
  })
  out_device: number;
}
