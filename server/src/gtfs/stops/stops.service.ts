import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  PaginatedResponse,
  PaginationParams,
} from '../../common/interfaces/pagination.interface';
import { GtfsSearchResponseItem } from '../routes/gtfs.entity';
import { Stop } from './stop.entity';

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

  async findByIds(ids: string[]): Promise<Stop[]> {
    return this.stopRepository.find({ where: { stop_id: In(ids) } });
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

  async findByLatLon(
    lat: number,
    lon: number,
    radius: number,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Stop>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'stop_id',
      sortOrder = 'ASC',
    } = params || {};

    const queryBuilder = this.stopRepository
      .createQueryBuilder('stop')
      .where(
        'ST_DWithin(ST_MakePoint(stop.stop_lon, stop.stop_lat)::geography, ST_MakePoint(:lon, :lat)::geography, :radius)',
        { lon, lat, radius },
      );

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

  async search(query: string): Promise<GtfsSearchResponseItem[]> {
    const ql = `
      SELECT
        json_build_object(
          'stop_id', stops.stop_id,
          'stop_name', stops.stop_name,
          'stop_lat', stops.stop_lat,
          'stop_lon', stops.stop_lon,
          'stop_code', stops.stop_code,
          'stop_desc', stops.stop_desc,
          'stop_url', stops.stop_url
        ) as stop,
        similarity(stop_name, $1) AS score
      FROM
        stops
      ORDER BY
        score DESC
      LIMIT 10
    `;
    return await this.stopRepository.query(ql, [query]);
  }
}
