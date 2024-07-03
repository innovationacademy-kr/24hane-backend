import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// deprecated
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
