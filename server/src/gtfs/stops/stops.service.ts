import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stop } from './stop.entity';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class StopsService {
  constructor(
    @InjectRepository(Stop)
    private stopRepository: Repository<Stop>,
  ) {}

  async findAll(params?: PaginationParams): Promise<PaginatedResponse<Stop>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'stop_id',
      sortOrder = 'ASC',
    } = params || {};

    const queryBuilder = this.stopRepository.createQueryBuilder('stop');

    // Add sorting
    queryBuilder.orderBy(`stop.${sortBy}`, sortOrder);

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

  async findById(id: string): Promise<Stop> {
    const stop = await this.stopRepository.findOne({ where: { stop_id: id } });
    if (!stop) {
      throw new NotFoundException(`Stop with ID ${id} not found`);
    }
    return stop;
  }

  async create(stop: Stop): Promise<Stop> {
    const newStop = this.stopRepository.create(stop);
    return this.stopRepository.save(newStop);
  }

  async update(id: string, stop: Stop): Promise<Stop> {
    const existingStop = await this.findById(id);
    const updatedStop = this.stopRepository.merge(existingStop, stop);
    return this.stopRepository.save(updatedStop);
  }

  async findByLatLon(lat: number, lon: number, radius: number, params?: PaginationParams): Promise<PaginatedResponse<Stop>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'stop_id',
      sortOrder = 'ASC',
    } = params || {};

    const queryBuilder = this.stopRepository
      .createQueryBuilder('stop')
      .where('ST_DWithin(ST_MakePoint(stop.stop_lon, stop.stop_lat)::geography, ST_MakePoint(:lon, :lat)::geography, :radius)',
        { lon, lat, radius });

    // Add sorting
    queryBuilder.orderBy(`stop.${sortBy}`, sortOrder);

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
} 