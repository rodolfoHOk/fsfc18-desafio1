import { Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SpotStatus } from '@prisma/client';
import { ResourceNotFoundException } from 'src/exceptions/resource-not-found.exception';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: createSpotDto.eventId,
      },
    });

    if (!event) {
      throw new ResourceNotFoundException('Event not found');
    }

    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.available,
      },
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: {
        eventId,
      },
    });
  }

  async findOne(eventId: string, spotId: string) {
    try {
      return await this.prismaService.spot.findFirstOrThrow({
        where: {
          id: spotId,
          eventId,
        },
      });
    } catch (error) {
      throw new ResourceNotFoundException('Spot not found');
    }
  }

  async update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    await this.findOne(eventId, spotId);

    return this.prismaService.spot.update({
      where: {
        id: spotId,
        eventId,
      },
      data: updateSpotDto,
    });
  }

  async remove(eventId: string, spotId: string) {
    await this.findOne(eventId, spotId);

    return this.prismaService.spot.delete({
      where: {
        id: spotId,
        eventId,
      },
    });
  }
}
