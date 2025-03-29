import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { Trip } from './trip.entity';
import { TripsService } from './trips.service';
import { PaginationParams } from '../../common/interfaces/pagination.interface';

@ApiTags('Trips')
@Controller('gtfs/trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by (default: trip_id)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (ASC or DESC, default: ASC)' })
  @ApiResponse({ status: 200, description: 'Returns paginated trips', type: [Trip] })
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
    return this.tripsService.findAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiResponse({ status: 200, description: 'Returns the trip', type: Trip })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  findById(@Param('id') id: string): Promise<Trip> {
    return this.tripsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'The trip has been successfully created.', type: Trip })
  create(@Body() trip: Trip): Promise<Trip> {
    return this.tripsService.create(trip);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a trip' })
  @ApiResponse({ status: 200, description: 'The trip has been successfully updated.', type: Trip })
  update(@Param('id') id: string, @Body() trip: Trip): Promise<Trip> {
    return this.tripsService.update(id, trip);
  }
} 