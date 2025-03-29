import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stop } from './stop.entity';
import { StopsController } from './stops.controller';
import { StopsService } from './stops.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stop])],
  controllers: [StopsController],
  providers: [StopsService],
  exports: [StopsService],
})
export class StopsModule {} 