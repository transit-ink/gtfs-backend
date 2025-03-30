import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Username for login' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password for login' })
  @IsString()
  password: string;
}
