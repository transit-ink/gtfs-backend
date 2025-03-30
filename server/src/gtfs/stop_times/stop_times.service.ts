import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StopTime } from './stop-time.entity';
import {
  PaginationParams,
  PaginatedResponse,
} from '../../common/interfaces/pagination.interface';

@Injectable()
export class StopTimesService {
  constructor(
    @InjectRepository(StopTime)
    private stopTimesRepository: Repository<StopTime>,
  ) {}

  async findAll(
    tripId?: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<StopTime>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'trip_id',
      sortOrder = 'ASC',
    } = params || {};

    const queryBuilder =
      this.stopTimesRepository.createQueryBuilder('stop_time');

    if (tripId) {
      queryBuilder.where('stop_time.trip_id = :tripId', { tripId });
    }

    // Add sorting
    queryBuilder.orderBy(`stop_time.${sortBy}`, sortOrder);

    // Add pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Get total count
    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(tripId: string): Promise<StopTime> {
    const stopTime = await this.stopTimesRepository.findOneBy({
      trip_id: tripId,
    });
    if (!stopTime) {
      throw new NotFoundException(`Stop time with trip ID ${tripId} not found`);
    }
    return stopTime;
  }

  async create(stopTime: StopTime): Promise<StopTime> {
    const newStopTime = this.stopTimesRepository.create(stopTime);
    return this.stopTimesRepository.save(newStopTime);
  }

  async update(tripId: string, stopTime: StopTime): Promise<StopTime> {
    const existingStopTime = await this.findOne(tripId);
    const updatedStopTime = this.stopTimesRepository.merge(
      existingStopTime,
      stopTime,
    );
    return this.stopTimesRepository.save(updatedStopTime);
  }
}
