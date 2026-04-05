import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { NotFoundException } from '@nestjs/common';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let service: ConcertsService;

  const mockConcert = {
    id: 1,
    name: 'Test Concert',
    description: 'A test concert',
    totalSeats: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    reservedSeats: 0,
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [{ provide: ConcertsService, useValue: mockService }],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    service = module.get<ConcertsService>(ConcertsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a concert', async () => {
      const dto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'A test concert',
        totalSeats: 100,
      };
      mockService.create.mockResolvedValue(mockConcert);

      const result = await controller.create(dto);

      expect(result).toEqual(mockConcert);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all concerts with reserved seats', async () => {
      mockService.findAll.mockResolvedValue([mockConcert]);

      const result = await controller.findAll();

      expect(result).toEqual([mockConcert]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no concerts', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('getStats', () => {
    it('should return dashboard stats', async () => {
      const stats = { totalConcerts: 5, totalSeats: 500, totalReserved: 50 };
      mockService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toEqual(stats);
    });
  });

  describe('remove', () => {
    it('should delete a concert', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent concert', async () => {
      mockService.remove.mockRejectedValue(
        new NotFoundException('Concert with ID 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
