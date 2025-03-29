import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { StopTimesModule } from '../stop_times/stop_times.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip]),
    StopTimesModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {} 