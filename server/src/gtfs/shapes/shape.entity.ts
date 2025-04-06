import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from '../trips/trip.entity';

@Entity('shapes')
export class Shape {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID of the shape' })
  @Index()
  @Column()
  shape_id: string;

  @ApiProperty({ description: 'Latitude of the shape point' })
  @Column({ type: 'decimal', precision: 10, scale: 8 })
  shape_pt_lat: number;

  @ApiProperty({ description: 'Longitude of the shape point' })
  @Column({ type: 'decimal', precision: 11, scale: 8 })
  shape_pt_lon: number;

  @ApiProperty({ description: 'Sequence number of the shape point' })
  @Column()
  shape_pt_sequence: number;

  @ApiProperty({
    description: 'Distance traveled along the shape from the first shape point',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  shape_dist_traveled?: number;

  @OneToMany(() => Trip, (trip) => trip.shape)
  trips: Trip[];
}
