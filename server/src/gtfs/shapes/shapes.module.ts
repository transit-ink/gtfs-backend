import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shape } from './shape.entity';
import { ShapesController } from './shapes.controller';
import { ShapesService } from './shapes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shape])],
  controllers: [ShapesController],
  providers: [ShapesService],
  exports: [ShapesService],
})
export class ShapesModule {} 