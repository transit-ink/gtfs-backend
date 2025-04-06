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
import { Trip } from './trip.entity';
import { TripsService } from './trips.service';

@ApiTags('Trips')
@Controller('gtfs/trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
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
    description: 'Field to sort by (default: trip_id)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (ASC or DESC, default: ASC)',
  })
  @ApiQuery({
    name: 'routeId',
    required: false,
    description: 'Filter trips by route ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated trips',
    type: [Trip],
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('routeId') routeId?: string,
  ) {
    const params: PaginationParams = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      sortBy,
      sortOrder,
      routeId,
    };
    return this.tripsService.findAll(params);
  }

  @Get('bulk')
  @ApiOperation({ summary: 'Get trips by IDs' })
  @ApiQuery({
    name: 'ids',
    required: true,
    description: 'Comma-separated list of trip IDs',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the trips',
    type: [Trip],
  })
  findBulk(@Query('ids') ids: string): Promise<Trip[]> {
    return this.tripsService.findBulk(ids.split(','));
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
  @ApiResponse({
    status: 201,
    description: 'The trip has been successfully created.',
    type: Trip,
  })
  create(@Body() trip: Trip): Promise<Trip> {
    return this.tripsService.create(trip);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a trip' })
  @ApiResponse({
    status: 200,
    description: 'The trip has been successfully updated.',
    type: Trip,
  })
  update(@Param('id') id: string, @Body() trip: Trip): Promise<Trip> {
    return this.tripsService.update(id, trip);
  }
}
