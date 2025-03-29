import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ShapesService } from './shapes.service';
import { Shape } from './shape.entity';
import { PaginationParams } from '../../common/interfaces/pagination.interface';

@ApiTags('Shapes')
@Controller('gtfs/shapes')
export class ShapesController {
  constructor(private readonly shapesService: ShapesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shapes' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by (default: shape_id)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (ASC or DESC, default: ASC)' })
  @ApiResponse({ status: 200, description: 'Returns paginated shapes', type: [Shape] })
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
    return this.shapesService.findAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shapes by ID' })
  @ApiResponse({ status: 200, description: 'Return the shapes' })
  findById(@Param('id') id: string): Promise<Shape[]> {
    return this.shapesService.findById(id);
  }
} 