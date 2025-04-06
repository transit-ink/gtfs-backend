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
import { Route } from './route.entity';
import { RoutesService } from './routes.service';

@ApiTags('Routes')
@Controller('gtfs/routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  @ApiQuery({
    name: 'agencyId',
    required: true,
    description: 'Filter routes by agency ID',
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
    description: 'Field to sort by (default: route_id)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (ASC or DESC, default: ASC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated routes',
    type: [Route],
  })
  findAll(
    @Query('agencyId') agencyId: string,
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
    return this.routesService.findAll(agencyId, params);
  }

  @Get('bulk')
  @ApiOperation({ summary: 'Get routes by IDs' })
  @ApiQuery({
    name: 'ids',
    required: true,
    description: 'Comma-separated list of route IDs',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the routes',
    type: [Route],
  })
  findBulk(@Query('ids') ids: string): Promise<Route[]> {
    return this.routesService.findBulk(ids.split(','));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a route by ID' })
  @ApiResponse({ status: 200, description: 'Returns the route', type: Route })
  findOne(@Param('id') id: string): Promise<Route> {
    return this.routesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new route' })
  @ApiResponse({
    status: 201,
    description: 'The route has been successfully created.',
    type: Route,
  })
  create(@Body() route: Route): Promise<Route> {
    return this.routesService.create(route);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a route' })
  @ApiResponse({
    status: 200,
    description: 'The route has been successfully updated.',
    type: Route,
  })
  update(@Param('id') id: string, @Body() route: Route): Promise<Route> {
    return this.routesService.update(id, route);
  }
}
