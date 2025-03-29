import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './calendar.entity';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarDatesModule } from '../calendar_dates/calendar_dates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar]),
    CalendarDatesModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {} 