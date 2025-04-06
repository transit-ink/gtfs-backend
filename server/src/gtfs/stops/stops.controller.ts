import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PaginationParams } from '../../common/interfaces/pagination.interface';
import { Stop } from './stop.entity';
import { StopsService } from './stops.service';

@ApiTags('Stops')
@Controller('gtfs/stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stops' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (default: stop_id)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (ASC or DESC, default: ASC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated stops',
    type: [Stop],
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const params: PaginationParams = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      sortBy,
      sortOrder,
    };
    return this.stopsService.findAll(params);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new stop' })
  @ApiResponse({
    status: 201,
    description: 'The stop has been successfully created.',
    type: Stop,
  })
  create(@Body() stop: Stop): Promise<Stop> {
    return this.stopsService.create(stop);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find stops near a location' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude' })
  @ApiQuery({ name: 'lon', required: true, description: 'Longitude' })
  @ApiQuery({
    name: 'radius',
    required: true,
    description: 'Search radius in meters',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (default: stop_id)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (ASC or DESC, default: ASC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated nearby stops',
    type: [Stop],
  })
  findByLatLon(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radius') radius: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const params: PaginationParams = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      sortBy,
      sortOrder,
    };
    return this.stopsService.findByLatLon(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(radius),
      params,
    );
  }

  @Get('bulk')
  @ApiOperation({ summary: 'Get stops by multiple IDs' })
  @ApiQuery({
    name: 'ids',
    required: true,
    description: 'Comma-separated list of stop IDs',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns stops matching the provided IDs',
    type: [Stop],
  })
  findByIds(@Query('ids') ids: string): Promise<Stop[]> {
    return this.stopsService.findByIds(ids.split(','));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stop by ID' })
  @ApiResponse({ status: 200, description: 'Returns the stop', type: Stop })
  @ApiResponse({ status: 404, description: 'Stop not found' })
  findById(@Param('id') id: string): Promise<Stop> {
    return this.stopsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a stop' })
  @ApiResponse({
    status: 200,
    description: 'The stop has been successfully updated.',
    type: Stop,
  })
  update(@Param('id') id: string, @Body() stop: Stop): Promise<Stop> {
    return this.stopsService.update(id, stop);
  }
}
