import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { Stop } from './stop.entity';
import { StopsService } from './stops.service';
import { PaginationParams } from '../../common/interfaces/pagination.interface';

@ApiTags('Stops')
@Controller('gtfs/stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stops' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by (default: stop_id)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (ASC or DESC, default: ASC)' })
  @ApiResponse({ status: 200, description: 'Returns paginated stops', type: [Stop] })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const params: PaginationParams = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    return this.stopsService.findAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stop by ID' })
  @ApiResponse({ status: 200, description: 'Returns the stop', type: Stop })
  @ApiResponse({ status: 404, description: 'Stop not found' })
  findById(@Param('id') id: string): Promise<Stop> {
    return this.stopsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new stop' })
  @ApiResponse({ status: 201, description: 'The stop has been successfully created.', type: Stop })
  create(@Body() stop: Stop): Promise<Stop> {
    return this.stopsService.create(stop);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a stop' })
  @ApiResponse({ status: 200, description: 'The stop has been successfully updated.', type: Stop })
  update(@Param('id') id: string, @Body() stop: Stop): Promise<Stop> {
    return this.stopsService.update(id, stop);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find stops near a location' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude' })
  @ApiQuery({ name: 'lon', required: true, description: 'Longitude' })
  @ApiQuery({ name: 'radius', required: true, description: 'Search radius in meters' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by (default: stop_id)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (ASC or DESC, default: ASC)' })
  @ApiResponse({ status: 200, description: 'Returns paginated nearby stops', type: [Stop] })
  findByLatLon(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const params: PaginationParams = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    return this.stopsService.findByLatLon(lat, lon, radius, params);
  }
} 