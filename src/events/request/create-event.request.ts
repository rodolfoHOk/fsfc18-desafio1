import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEventRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsISO8601()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
