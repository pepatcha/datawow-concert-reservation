import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservationLog } from '../reservations/entities/reservation-log.entity';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Reservation, ReservationLog])],
  controllers: [ConcertsController],
  providers: [ConcertsService],
  exports: [ConcertsService],
})
export class ConcertsModule {}
