import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  create(@Body() dto: CreateConcertDto) {
    return this.concertsService.create(dto);
  }

  @Get()
  findAll() {
    return this.concertsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.concertsService.getStats();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.concertsService.remove(id);
  }
}
