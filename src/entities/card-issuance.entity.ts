import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInfo } from './user-info.entity';

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
    type: 'datetime',
  })
  start_use: Date;

  @Column({
    name: 'END_USE',
    type: 'datetime',
    nullable: true,
  })
  end_use: Date;

  @ManyToOne(() => UserInfo, (userInfo) => userInfo.user_id)
  @JoinColumn({ name: 'USER_ID' })
  userInfo: UserInfo;
}
