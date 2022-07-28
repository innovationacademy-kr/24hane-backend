import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CARD_ISSUANCE')
export class CardIssuance {
  @PrimaryGeneratedColumn({
    name: 'IDX',
  })
  idx: number;

  @Column({
    name: 'USER_ID',
    type: 'int',
  })
  user_id: number;

  @Column({
    name: 'CARD_ID',
    type: 'varchar',
    length: 20,
  })
  card_id: string;

  @Column({
    name: 'START_USE',
    type: 'timestamp',
  })
  start_use: number;

  @Column({
    name: 'END_USE',
    type: 'timestamp',
    nullable: true,
  })
  end_use: number;

  /*
  @Column({
    name: 'UPDATE_AT',
    type: 'timestamp',
    nullable: true,
  })
  update_at: number;
  */
}
