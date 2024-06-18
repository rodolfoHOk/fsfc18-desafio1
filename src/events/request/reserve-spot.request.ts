import { TicketKind } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ReserveSpotRequest {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  spots: string[];

  @IsNotEmpty()
  @IsIn(['full', 'half'])
  ticket_kind: TicketKind;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
