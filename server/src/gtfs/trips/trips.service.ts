import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
  ) {}

  async findAll(params?: PaginationParams): Promise<PaginatedResponse<Trip>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'trip_id',
      sortOrder = 'ASC',
    } = params || {};

    const queryBuilder = this.tripRepository.createQueryBuilder('trip');

    // Add sorting
    queryBuilder.orderBy(`trip.${sortBy}`, sortOrder);

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

  async findById(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({ where: { trip_id: id } });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return trip;
  }

  async create(trip: Trip): Promise<Trip> {
    const newTrip = this.tripRepository.create(trip);
    return this.tripRepository.save(newTrip);
  }

  async update(id: string, trip: Trip): Promise<Trip> {
    const existingTrip = await this.findById(id);
    const updatedTrip = this.tripRepository.merge(existingTrip, trip);
    return this.tripRepository.save(updatedTrip);
  }
} 