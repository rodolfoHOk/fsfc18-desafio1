import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSpotRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
