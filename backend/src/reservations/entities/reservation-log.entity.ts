import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Concert } from '../../concerts/entities/concert.entity';

export enum ReservationAction {
  RESERVE = 'reserve',
  CANCEL = 'cancel',
}

@Entity('reservation_logs')
export class ReservationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Concert, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'concert_id' })
  concert: Concert;

  @Column({ type: 'enum', enum: ReservationAction })
  action: ReservationAction;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
