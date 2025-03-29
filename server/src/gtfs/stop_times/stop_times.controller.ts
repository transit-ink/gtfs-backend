import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { StopTime } from './stop-time.entity';
import { StopTimesService } from './stop_times.service';
import { PaginationParams } from '../../common/interfaces/pagination.interface';

@ApiTags('Stop Times')
@Controller('gtfs/stop_times')
export class StopTimesController {
  constructor(private readonly stopTimesService: StopTimesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stop times' })
  @ApiQuery({ name: 'tripId', required: false, description: 'Filter stop times by trip ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by (default: trip_id)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (ASC or DESC, default: ASC)' })
  @ApiResponse({ status: 200, description: 'Returns paginated stop times', type: [StopTime] })
  findAll(
    @Query('tripId') tripId?: string,
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
    return this.stopTimesService.findAll(tripId, params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stop time by ID' })
  @ApiResponse({ status: 200, description: 'Returns the stop time', type: StopTime })
  findOne(@Param('id') id: string): Promise<StopTime> {
    return this.stopTimesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new stop time' })
  @ApiResponse({ status: 201, description: 'The stop time has been successfully created.', type: StopTime })
  create(@Body() stopTime: StopTime): Promise<StopTime> {
    return this.stopTimesService.create(stopTime);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a stop time' })
  @ApiResponse({ status: 200, description: 'The stop time has been successfully updated.', type: StopTime })
  update(@Param('id') id: string, @Body() stopTime: StopTime): Promise<StopTime> {
    return this.stopTimesService.update(id, stopTime);
  }
} 