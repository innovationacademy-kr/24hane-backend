import Cluster from 'src/enums/cluster.enum';
import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

// deprecated
@Entity()
export class Alive {
  @PrimaryGeneratedColumn()
  seq: number;

  @Index()
  @Column()
  intra_id: string;

  @Column()
  alive: boolean;

  @Column()
  timestamp: Date;

  @Column({ nullable: true })
  cluster: Cluster;
}
