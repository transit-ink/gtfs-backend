import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarDate } from './calendar-date.entity';
import { CalendarDatesController } from './calendar_dates.controller';
import { CalendarDatesService } from './calendar_dates.service';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarDate])],
  controllers: [CalendarDatesController],
  providers: [CalendarDatesService],
  exports: [CalendarDatesService],
})
export class CalendarDatesModule {} 