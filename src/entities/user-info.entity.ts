import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { CardIssuance } from './card-issuance.entity';

@Entity('USER_INFO')
export class UserInfo {
  @PrimaryColumn({
    name: 'USER_ID',
    type: 'int',
  })
  user_id: number;

  @Column({
    name: 'IS_ADMIN',
    type: 'boolean',
  })
  is_admin: boolean;

  @Column({
    name: 'LOGIN',
    type: 'varchar',
    length: 50,
  })
  login: string;

  @OneToMany(() => CardIssuance, (cardIssuance) => cardIssuance.userInfo)
  cardIssuance: CardIssuance[];
}
