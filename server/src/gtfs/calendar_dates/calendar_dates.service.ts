import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarDate } from './calendar-date.entity';

@Injectable()
export class CalendarDatesService {
  constructor(
    @InjectRepository(CalendarDate)
    private calendarDateRepository: Repository<CalendarDate>,
  ) {}

  async findAll(): Promise<CalendarDate[]> {
    return this.calendarDateRepository.find();
  }

  async findByServiceId(serviceId: string): Promise<CalendarDate[]> {
    return this.calendarDateRepository.find({ where: { service_id: serviceId } });
  }

  async create(calendarDate: CalendarDate): Promise<CalendarDate> {
    const newCalendarDate = this.calendarDateRepository.create(calendarDate);
    return this.calendarDateRepository.save(newCalendarDate);
  }

  async update(id: string, calendarDate: CalendarDate): Promise<CalendarDate> {
    const existingCalendarDate = await this.calendarDateRepository.findOne({ where: { service_id: id } });
    if (!existingCalendarDate) {
      throw new NotFoundException(`Calendar date with service ID ${id} not found`);
    }
    const updatedCalendarDate = this.calendarDateRepository.merge(existingCalendarDate, calendarDate);
    return this.calendarDateRepository.save(updatedCalendarDate);
  }
} 