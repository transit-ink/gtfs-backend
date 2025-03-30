import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { username, email, password } = createUserDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new UnauthorizedException('Username or email already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      username,
      email,
      password,
      roles: [UserRole.USER],
    });

    // Hash password
    await user.hashPassword();

    // Save user
    await this.userRepository.save(user);

    // Generate token
    const token = this.generateToken(user);

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Your email is not verified. Please reach out to us',
      );
    }

    // Generate token
    const token = this.generateToken(user);

    return { token };
  }

  async updateUserRoles(userId: string, roles: UserRole[]): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.roles = roles;
    return this.userRepository.save(user);
  }

  private generateToken(user: User): string {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }
}
