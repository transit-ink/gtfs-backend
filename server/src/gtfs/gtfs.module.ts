import { Module } from '@nestjs/common';
import { StopsModule } from './stops/stops.module';
import { RoutesModule } from './routes/routes.module';
import { TripsModule } from './trips/trips.module';
import { CalendarModule } from './calendar/calendar.module';
import { CalendarDatesModule } from './calendar_dates/calendar_dates.module';
import { ShapesModule } from './shapes/shapes.module';
import { AgencyModule } from './agency/agency.module';
import { StopTimesModule } from './stop_times/stop_times.module';

@Module({
  imports: [
    StopsModule,
    RoutesModule,
    TripsModule,
    CalendarModule,
    CalendarDatesModule,
    ShapesModule,
    AgencyModule,
    StopTimesModule,
  ],
  controllers: [],
  providers: [],
})
export class GtfsModule {} 