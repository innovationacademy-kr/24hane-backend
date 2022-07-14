import Cluster from 'src/enums/cluster.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Alive {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column()
  intra_id: string;

  @Column()
  alive: boolean;

  @Column()
  timestamp: Date;

  @Column()
  cluster: Cluster;
}
