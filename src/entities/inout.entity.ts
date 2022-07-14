import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inout {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column()
  intra_id: string;

  @Column()
  timestamp: Date;

  @Column()
  inout: InOut;

  @Column()
  cluster: Cluster;
}
