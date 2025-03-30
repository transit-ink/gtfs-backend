import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import {
  PaginationParams,
  PaginatedResponse,
} from '../../common/interfaces/pagination.interface';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
  ) {}

  async findAll(
    agencyId?: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Route>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'route_id',
      sortOrder = 'ASC',
    } = params || {};

    const queryBuilder = this.routesRepository.createQueryBuilder('route');

    if (agencyId) {
      queryBuilder.where('route.agency_id = :agencyId', { agencyId });
    }

    // Add sorting
    queryBuilder.orderBy(`route.${sortBy}`, sortOrder);

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

  async findOne(id: string): Promise<Route> {
    const route = await this.routesRepository.findOneBy({ route_id: id });
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return route;
  }

  async findByAgency(
    agencyId: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Route>> {
    return this.findAll(agencyId, params);
  }

  async create(route: Route): Promise<Route> {
    const newRoute = this.routesRepository.create(route);
    return this.routesRepository.save(newRoute);
  }

  async update(id: string, route: Route): Promise<Route> {
    const existingRoute = await this.findOne(id);
    const updatedRoute = this.routesRepository.merge(existingRoute, route);
    return this.routesRepository.save(updatedRoute);
  }
}
