import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'Concert ID is required' })
  @IsInt({ message: 'Concert ID must be an integer' })
  @IsPositive({ message: 'Concert ID must be a positive number' })
  concertId: number;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsInt({ message: 'User ID must be an integer' })
  @IsPositive({ message: 'User ID must be a positive number' })
  userId: number;
}
