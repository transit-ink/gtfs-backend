import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CalendarDate } from '../calendar_dates/calendar-date.entity';
import { Trip } from '../trips/trip.entity';

@Entity('calendar')
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID of the service' })
  @Index({ unique: true })
  @Column()
  service_id: string;

  @ApiProperty({
    description: 'Indicates whether the service is available on Monday',
  })
  @Column({ type: 'boolean' })
  monday: boolean;

  @ApiProperty({
    description: 'Indicates whether the service is available on Tuesday',
  })
  @Column({ type: 'boolean' })
  tuesday: boolean;

  @ApiProperty({
    description: 'Indicates whether the service is available on Wednesday',
  })
  @Column({ type: 'boolean' })
  wednesday: boolean;

  @ApiProperty({
    description: 'Indicates whether the service is available on Thursday',
  })
  @Column({ type: 'boolean' })
  thursday: boolean;

  @ApiProperty({
    description: 'Indicates whether the service is available on Friday',
  })
  @Column({ type: 'boolean' })
  friday: boolean;

  @ApiProperty({
    description: 'Indicates whether the service is available on Saturday',
  })
  @Column({ type: 'boolean' })
  saturday: boolean;

  @ApiProperty({
    description: 'Indicates whether the service is available on Sunday',
  })
  @Column({ type: 'boolean' })
  sunday: boolean;

  @ApiProperty({ description: 'Start date of the service' })
  @Column({ type: 'date' })
  start_date: Date;

  @ApiProperty({ description: 'End date of the service' })
  @Column({ type: 'date' })
  end_date: Date;

  @OneToMany(
    () => CalendarDate,
    (calendarDate: CalendarDate) => calendarDate.calendar,
  )
  calendar_dates: CalendarDate[];

  @OneToMany(() => Trip, (trip) => trip.calendar)
  trips: Trip[];
}
