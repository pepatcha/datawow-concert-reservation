import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('reservations')
  reserve(@Body() dto: CreateReservationDto) {
    return this.reservationsService.reserve(dto);
  }

  @Delete('reservations/:id')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.cancel(id);
  }

  @Get('reservations/user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.reservationsService.findByUser(userId);
  }

  @Get('reservation-logs')
  findAllLogs() {
    return this.reservationsService.findAllLogs();
  }

  @Get('reservation-logs/user/:userId')
  findLogsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.reservationsService.findLogsByUser(userId);
  }
}
