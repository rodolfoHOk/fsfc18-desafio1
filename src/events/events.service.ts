import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceNotFoundException } from 'src/exceptions/resource-not-found.exception';
import { SpotsAlreadyReservedException } from 'src/exceptions/spots-already-reserved.exception';
import { ReservationException } from 'src/exceptions/reservation.exception';
import { ConstraintViolationException } from 'src/exceptions/constraint-violation.exception';
import { PartnerApiException } from 'src/exceptions/partner-api.exception';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.event.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new ResourceNotFoundException('Event not found');
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.findOne(id);

    return this.prismaService.event.update({
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
      where: { id },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.prismaService.event.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003': // Foreign key constraint violation
            throw new ConstraintViolationException(
              'Foreign key constraint error on try remove event',
            );
          default:
            throw new PartnerApiException('Error on try remove event');
        }
      }
      throw new PartnerApiException('Error on try remove event');
    }
  }

  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: dto.eventId,
        name: {
          in: dto.spots,
        },
      },
    });
    if (spots.length !== dto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsName = dto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new ResourceNotFoundException(
        `Spots not exists: ${notFoundSpotsName.join(', ')}`,
      );
    }

    const spotsAlreadyReserved = spots.filter(
      (spot) => spot.status === 'reserved',
    );
    if (spotsAlreadyReserved.length > 0) {
      throw new SpotsAlreadyReservedException(
        `Spots ${spotsAlreadyReserved.map((spot) => spot.name).join(', ')} is not available for reservation`,
      );
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind: dto.ticket_kind,
              email: dto.email,
              status: TicketStatus.reserved,
            })),
          });

          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: SpotStatus.reserved,
            },
          });

          const tickets = await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: dto.ticket_kind,
                  email: dto.email,
                },
              }),
            ),
          );

          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      return tickets;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002': // unique constraint violation
          case 'P2034': // transaction conflict
            throw new SpotsAlreadyReservedException(
              'Some spots are already reserved',
            );
          default:
            throw new ReservationException(e.message);
        }
      }
      throw new ReservationException(e.message);
    }
  }
}
