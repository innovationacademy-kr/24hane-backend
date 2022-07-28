import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('USER_INFO')
export class Inout {
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
}
