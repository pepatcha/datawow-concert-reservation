import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConcertsService } from './concerts.service';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservationLog } from '../reservations/entities/reservation-log.entity';
import { NotFoundException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;

  const mockConcert = {
    id: 1,
    name: 'Test Concert',
    description: 'A test concert',
    totalSeats: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockConcertRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockReservationRepo = {
    count: jest.fn(),
  };

  const mockLogRepo = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        { provide: getRepositoryToken(Concert), useValue: mockConcertRepo },
        { provide: getRepositoryToken(Reservation), useValue: mockReservationRepo },
        { provide: getRepositoryToken(ReservationLog), useValue: mockLogRepo },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a concert', async () => {
      mockConcertRepo.create.mockReturnValue(mockConcert);
      mockConcertRepo.save.mockResolvedValue(mockConcert);

      const result = await service.create({
        name: 'Test Concert',
        description: 'A test concert',
        totalSeats: 100,
      });

      expect(result).toEqual(mockConcert);
      expect(mockConcertRepo.create).toHaveBeenCalled();
      expect(mockConcertRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return concerts with reserved seats count', async () => {
      mockConcertRepo.find.mockResolvedValue([mockConcert]);
      mockReservationRepo.count.mockResolvedValue(10);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].reservedSeats).toBe(10);
    });

    it('should return empty array when no concerts', async () => {
      mockConcertRepo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should remove an existing concert', async () => {
      mockConcertRepo.findOne.mockResolvedValue(mockConcert);
      mockConcertRepo.remove.mockResolvedValue(mockConcert);

      await service.remove(1);

      expect(mockConcertRepo.remove).toHaveBeenCalledWith(mockConcert);
    });

    it('should throw NotFoundException if concert not found', async () => {
      mockConcertRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return correct stats', async () => {
      mockConcertRepo.find.mockResolvedValue([
        { ...mockConcert, totalSeats: 100 },
        { ...mockConcert, id: 2, totalSeats: 200 },
      ]);
      mockReservationRepo.count.mockResolvedValue(50);
      mockLogRepo.count.mockResolvedValue(5);

      const result = await service.getStats();

      expect(result.totalConcerts).toBe(2);
      expect(result.totalSeats).toBe(300);
      expect(result.totalReserved).toBe(50);
      expect(result.totalCancelled).toBe(5);
    });
  });
});
