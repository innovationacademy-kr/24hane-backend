import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TAG_LOG')
export class TagLog {
  @PrimaryGeneratedColumn({
    name: 'IDX',
  })
  idx: number;

  @Column({
    name: 'TAG_AT',
    type: 'datetime',
  })
  tag_at: Date;

  @Column({
    name: 'CARD_ID',
    type: 'varchar',
    length: 15,
  })
  card_id: string;

  @Column({
    name: 'DEVICE_ID',
    type: 'int',
  })
  device_id: number;
}
