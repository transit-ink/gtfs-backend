import { Entity, Column, PrimaryColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Route } from '../routes/route.entity';
import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

@Entity('agency')
export class Agency {
  @ApiProperty({ description: 'Unique identifier for the agency' })
  @PrimaryColumn()
  @IsNotEmpty()
  @IsString()
  agency_id: string;

  @ApiProperty({ description: 'Full name of the agency' })
  @Column()
  @IsNotEmpty()
  @IsString()
  agency_name: string;

  @ApiProperty({ description: 'URL of the agency' })
  @Column()
  @IsNotEmpty()
  @IsUrl()
  agency_url: string;

  @ApiProperty({ description: 'Timezone of the agency' })
  @Column()
  @IsNotEmpty()
  @IsString()
  agency_timezone: string;

  @ApiProperty({ description: 'Primary language of the agency' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  agency_lang?: string;

  @ApiProperty({ description: 'Phone number of the agency' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  agency_phone?: string;

  @ApiProperty({ description: 'URL for purchasing tickets' })
  @Column({ nullable: true })
  @IsOptional()
  @IsUrl()
  agency_fare_url?: string;

  @ApiProperty({ description: 'Email address of the agency' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  agency_email?: string;

  @OneToMany(() => Route, route => route.agency)
  routes: Route[];

  @BeforeInsert()
  @BeforeUpdate()
  validateRequiredFields() {
    if (!this.agency_id) {
      throw new Error('agency_id is required');
    }
    if (!this.agency_name) {
      throw new Error('agency_name is required');
    }
    if (!this.agency_url) {
      throw new Error('agency_url is required');
    }
    if (!this.agency_timezone) {
      throw new Error('agency_timezone is required');
    }
  }
} 