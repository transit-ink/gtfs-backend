import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbSyncService } from './db-sync.service';
import { Agency } from '../gtfs/agency/agency.entity';
import { Stop } from '../gtfs/stops/stop.entity';
import { Route } from '../gtfs/routes/route.entity';
import { Trip } from '../gtfs/trips/trip.entity';
import { StopTime } from '../gtfs/stop_times/stop-time.entity';
import { Calendar } from '../gtfs/calendar/calendar.entity';
import { CalendarDate } from '../gtfs/calendar_dates/calendar-date.entity';
import { Shape } from '../gtfs/shapes/shape.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agency,
      Stop,
      Route,
      Trip,
      StopTime,
      Calendar,
      CalendarDate,
      Shape,
      User
    ])
  ],
  providers: [DbSyncService],
  exports: [DbSyncService]
})
export class UtilsModule {} 