import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  PaginatedResponse,
  PaginationParams,
} from '../../common/interfaces/pagination.interface';
import { GtfsSearchResponseItem } from './gtfs.entity';
import { Route } from './route.entity';

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

  async findBulk(ids: string[]): Promise<Route[]> {
    const routes = await this.routesRepository.find({
      where: { route_id: In(ids) },
    });
    return routes;
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

  async search(query: string): Promise<GtfsSearchResponseItem[]> {
    const ql = `
      SELECT
        json_build_object(
          'route_id', routes.route_id,
          'agency_id', routes.agency_id,
          'route_short_name', routes.route_short_name,
          'route_long_name', routes.route_long_name,
          'route_desc', routes.route_desc,
          'route_type', routes.route_type,
          'route_url', routes.route_url,
          'route_color', routes.route_color,
          'route_text_color', routes.route_text_color
        ) as route,
        similarity(route_short_name, $1) AS score
      FROM
        routes
      ORDER BY
        score DESC
      LIMIT 10
    `;
    return await this.routesRepository.query(ql, [query]);
  }
}
