import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';
import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inout {
  @PrimaryGeneratedColumn()
  seq: number;

  @Index()
  @Column()
  intra_id: string;

  @Column()
  timestamp: Date;

  @Column()
  inout: InOut;

  @Column({ nullable: true })
  cluster: Cluster;
}
