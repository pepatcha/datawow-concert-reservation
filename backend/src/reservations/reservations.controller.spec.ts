import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockReservation = {
    id: 1,
    user: { id: 2, username: 'user' },
    concert: { id: 1, name: 'Test Concert' },
    createdAt: new Date(),
  };

  const mockLog = {
    id: 1,
    user: { id: 2, username: 'user' },
    concert: { id: 1, name: 'Test Concert' },
    action: 'reserve' as const,
    createdAt: new Date(),
  };

  const mockService = {
    reserve: jest.fn(),
    cancel: jest.fn(),
    findByUser: jest.fn(),
    findAllLogs: jest.fn(),
    findLogsByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [{ provide: ReservationsService, useValue: mockService }],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
    jest.clearAllMocks();
  });

  describe('reserve', () => {
    it('should create a reservation', async () => {
      const dto: CreateReservationDto = { concertId: 1, userId: 2 };
      mockService.reserve.mockResolvedValue(mockReservation);

      const result = await controller.reserve(dto);

      expect(result).toEqual(mockReservation);
      expect(service.reserve).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException when no seats available', async () => {
      const dto: CreateReservationDto = { concertId: 1, userId: 2 };
      mockService.reserve.mockRejectedValue(
        new BadRequestException('No seats available'),
      );

      await expect(controller.reserve(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when already reserved', async () => {
      const dto: CreateReservationDto = { concertId: 1, userId: 2 };
      mockService.reserve.mockRejectedValue(
        new ConflictException('You have already reserved this concert'),
      );

      await expect(controller.reserve(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', async () => {
      mockService.cancel.mockResolvedValue(undefined);

      await controller.cancel(1);

      expect(service.cancel).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent reservation', async () => {
      mockService.cancel.mockRejectedValue(
        new NotFoundException('Reservation not found'),
      );

      await expect(controller.cancel(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return active reservations for a user', async () => {
      mockService.findByUser.mockResolvedValue([mockReservation]);

      const result = await controller.findByUser(2);

      expect(result).toEqual([mockReservation]);
      expect(service.findByUser).toHaveBeenCalledWith(2);
    });
  });

  describe('findAllLogs', () => {
    it('should return all reservation logs', async () => {
      mockService.findAllLogs.mockResolvedValue([mockLog]);

      const result = await controller.findAllLogs();

      expect(result).toEqual([mockLog]);
    });
  });

  describe('findLogsByUser', () => {
    it('should return logs for a specific user', async () => {
      mockService.findLogsByUser.mockResolvedValue([mockLog]);

      const result = await controller.findLogsByUser(2);

      expect(result).toEqual([mockLog]);
      expect(service.findLogsByUser).toHaveBeenCalledWith(2);
    });
  });
});
