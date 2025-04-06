import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Calendar } from '../calendar/calendar.entity';

export enum ExceptionType {
  SERVICE_ADDED = 1,
  SERVICE_REMOVED = 2,
}

@Entity('calendar_dates')
export class CalendarDate {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID of the service' })
  @Index()
  @Column()
  service_id: string;

  @ApiProperty({ description: 'Date of the service exception' })
  @Column({
    type: 'date',
    transformer: {
      to: (value: string | Date) =>
        value instanceof Date ? value : new Date(value),
      from: (value: Date) => value,
    },
  })
  date: string | Date;

  @ApiProperty({ description: 'Type of exception', enum: ExceptionType })
  @Column({ type: 'enum', enum: ExceptionType })
  exception_type: ExceptionType;

  @ManyToOne(() => Calendar, (calendar) => calendar.calendar_dates)
  @JoinColumn({ name: 'service_id', referencedColumnName: 'service_id' })
  calendar: Calendar;
}
