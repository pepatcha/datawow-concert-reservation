import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { ReservationLog } from './entities/reservation-log.entity';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const mockConcert = { id: 1, name: 'Test', totalSeats: 2 };
  const mockUser = { id: 2, username: 'user' };

  const mockReservationRepo = {
    find: jest.fn(),
  };

  const mockLogRepo = {
    find: jest.fn(),
  };

  const mockManager = {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn((cb) => cb(mockManager)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: getRepositoryToken(Reservation), useValue: mockReservationRepo },
        { provide: getRepositoryToken(ReservationLog), useValue: mockLogRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    jest.clearAllMocks();
  });

  describe('reserve', () => {
    it('should create a reservation and log', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockConcert) // find concert
        .mockResolvedValueOnce(null) // no existing reservation
        .mockResolvedValueOnce(mockUser); // find user
      mockManager.count.mockResolvedValue(0);
      mockManager.create.mockReturnValue({ user: { id: 2 }, concert: { id: 1 } });
      mockManager.save
        .mockResolvedValueOnce({ id: 1, user: { id: 2 }, concert: { id: 1 } }) // reservation
        .mockResolvedValueOnce({}); // log

      const result = await service.reserve({ concertId: 1, userId: 2 });

      expect(result.id).toBe(1);
      expect(mockManager.save).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if concert not found', async () => {
      mockManager.findOne.mockResolvedValueOnce(null);

      await expect(service.reserve({ concertId: 999, userId: 2 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when no seats available', async () => {
      mockManager.findOne.mockResolvedValueOnce({ ...mockConcert, totalSeats: 2 });
      mockManager.count.mockResolvedValue(2);

      await expect(service.reserve({ concertId: 1, userId: 2 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException when user already reserved', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockConcert) // concert exists
        .mockResolvedValueOnce({ id: 1 }); // existing reservation
      mockManager.count.mockResolvedValue(1);

      await expect(service.reserve({ concertId: 1, userId: 2 })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockConcert) // concert
        .mockResolvedValueOnce(null) // no existing reservation
        .mockResolvedValueOnce(null); // user not found
      mockManager.count.mockResolvedValue(0);

      await expect(service.reserve({ concertId: 1, userId: 999 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancel', () => {
    it('should delete reservation and log cancel action', async () => {
      const reservation = {
        id: 1,
        user: { id: 2 },
        concert: { id: 1 },
      };
      mockManager.findOne.mockResolvedValue(reservation);
      mockManager.remove.mockResolvedValue(reservation);
      mockManager.save.mockResolvedValue({});

      await service.cancel(1);

      expect(mockManager.remove).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalledWith(
        ReservationLog,
        expect.objectContaining({ action: 'cancel' }),
      );
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockManager.findOne.mockResolvedValue(null);

      await expect(service.cancel(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return active reservations for a user', async () => {
      const reservations = [{ id: 1, user: mockUser, concert: mockConcert }];
      mockReservationRepo.find.mockResolvedValue(reservations);

      const result = await service.findByUser(2);

      expect(result).toEqual(reservations);
    });
  });

  describe('findAllLogs', () => {
    it('should return all logs ordered by date DESC', async () => {
      const logs = [{ id: 1, action: 'reserve' }];
      mockLogRepo.find.mockResolvedValue(logs);

      const result = await service.findAllLogs();

      expect(result).toEqual(logs);
      expect(mockLogRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { createdAt: 'DESC' } }),
      );
    });
  });

  describe('findLogsByUser', () => {
    it('should return logs for specific user', async () => {
      const logs = [{ id: 1, action: 'reserve', user: mockUser }];
      mockLogRepo.find.mockResolvedValue(logs);

      const result = await service.findLogsByUser(2);

      expect(result).toEqual(logs);
    });
  });
});
