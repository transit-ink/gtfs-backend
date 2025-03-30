import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Username for the user' })
  @Column({ unique: true })
  @Transform(({ value }) => value?.trim())
  username: string;

  @ApiProperty({ description: 'Email for the user' })
  @Column({ unique: true })
  @Transform(({ value }) => value?.trim())
  email: string;

  @Column()
  password: string;

  @ApiProperty({ description: 'User roles', enum: UserRole, isArray: true })
  @Column('enum', { array: true, enum: UserRole, default: [UserRole.USER] })
  roles: UserRole[];

  @ApiProperty({ description: 'Whether the email is verified' })
  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
