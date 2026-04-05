import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationLog, ReservationAction } from './entities/reservation-log.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { User } from '../users/entities/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationLog)
    private readonly logRepository: Repository<ReservationLog>,
    private readonly dataSource: DataSource,
  ) {}

  async reserve(dto: CreateReservationDto): Promise<Reservation> {
    return this.dataSource.transaction(async (manager) => {
      const concert = await manager.findOne(Concert, {
        where: { id: dto.concertId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!concert) {
        throw new NotFoundException('Concert not found');
      }

      const reservedCount = await manager.count(Reservation, {
        where: { concert: { id: dto.concertId } },
      });

      if (reservedCount >= concert.totalSeats) {
        throw new BadRequestException('No seats available');
      }

      const existing = await manager.findOne(Reservation, {
        where: {
          user: { id: dto.userId },
          concert: { id: dto.concertId },
        },
      });

      if (existing) {
        throw new ConflictException('You have already reserved this concert');
      }

      const user = await manager.findOne(User, {
        where: { id: dto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const reservation = manager.create(Reservation, {
        user: { id: dto.userId },
        concert: { id: dto.concertId },
      });
      const saved = await manager.save(Reservation, reservation);

      await manager.save(ReservationLog, {
        user: { id: dto.userId },
        concert: { id: dto.concertId },
        action: ReservationAction.RESERVE,
      });

      return saved;
    });
  }

  async cancel(id: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(Reservation, {
        where: { id },
        relations: ['user', 'concert'],
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      await manager.remove(Reservation, reservation);

      await manager.save(ReservationLog, {
        user: { id: reservation.user.id },
        concert: { id: reservation.concert.id },
        action: ReservationAction.CANCEL,
      });
    });
  }

  async findByUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'concert'],
    });
  }

  async findAllLogs(): Promise<ReservationLog[]> {
    return this.logRepository.find({
      relations: ['user', 'concert'],
      order: { createdAt: 'DESC' },
    });
  }

  async findLogsByUser(userId: number): Promise<ReservationLog[]> {
    return this.logRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'concert'],
      order: { createdAt: 'DESC' },
    });
  }
}
