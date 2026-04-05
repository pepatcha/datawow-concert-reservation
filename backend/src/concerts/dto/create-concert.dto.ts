import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateConcertDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Total seats is required' })
  @IsInt({ message: 'Total seats must be an integer' })
  @Min(1, { message: 'Total seats must be at least 1' })
  totalSeats: number;
}
