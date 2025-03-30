import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: 'Username for the user' })
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value?.trim())
  @Type(() => String)
  username: string;

  @ApiProperty({ description: 'Email for the user' })
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @Type(() => String)
  email: string;

  @ApiProperty({ description: 'Password for the user' })
  @IsString()
  @MinLength(6)
  @Type(() => String)
  password: string;
}
