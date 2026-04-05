import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservationLog, ReservationAction } from '../reservations/entities/reservation-log.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationLog)
    private readonly logRepository: Repository<ReservationLog>,
  ) {}

  async create(dto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertRepository.create(dto);
    return this.concertRepository.save(concert);
  }

  async findAll(): Promise<(Concert & { reservedSeats: number })[]> {
    const concerts = await this.concertRepository.find({
      order: { createdAt: 'DESC' },
    });

    const result = await Promise.all(
      concerts.map(async (concert) => {
        const reservedSeats = await this.reservationRepository.count({
          where: { concert: { id: concert.id } },
        });
        return { ...concert, reservedSeats };
      }),
    );

    return result;
  }

  async remove(id: number): Promise<void> {
    const concert = await this.concertRepository.findOne({ where: { id } });
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    await this.concertRepository.remove(concert);
  }

  async getStats(): Promise<{
    totalConcerts: number;
    totalSeats: number;
    totalReserved: number;
    totalCancelled: number;
  }> {
    const concerts = await this.concertRepository.find();
    const totalConcerts = concerts.length;
    const totalSeats = concerts.reduce((sum, c) => sum + c.totalSeats, 0);
    const totalReserved = await this.reservationRepository.count();
    const totalCancelled = await this.logRepository.count({
      where: { action: ReservationAction.CANCEL },
    });

    return { totalConcerts, totalSeats, totalReserved, totalCancelled };
  }
}
