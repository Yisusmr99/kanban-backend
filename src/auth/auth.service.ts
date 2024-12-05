import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ResponseHelper } from '../utils/response.helper'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const compare = await bcrypt.compare(password, user.password);
    if (user && compare) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (user) {
      const payload = { email: user.email, sub: user.id };

      const access_token = this.jwtService.sign(payload, { expiresIn: '6h' });
      const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
      await this.usersRepository.update(user.id, { refresh_token });

      const data = {
        access_token: access_token,
        refresh_token: refresh_token,
        user
      }
      return ResponseHelper.success('Login successful', data);
    }
    return ResponseHelper.error('Invalid credentials', null, 401);
  }

  async register(email: string, password: string, username: string, fullName: string) {
    try {
      const existingUser = await this.usersService.findOneByEmail(email);
      const existingUsername = await this.usersService.findOneByUsername(username);

      if (existingUser || existingUsername) {
        return ResponseHelper.error('User already exists', null, 400);
      }

      const user = await this.usersService.createUser(email, password, username, fullName);
      return ResponseHelper.success('User registered successfully', user);
    } catch (error) {
      return ResponseHelper.error('Failed to register user', error.message, 500);
    }
  }

  async refreshToken(refresh_token: string) {
    try {
      const payload = this.jwtService.verify(refresh_token);
      const user = await this.usersRepository.findOne({ where: { id: payload.sub, refresh_token } });
      if (!user) {
        return ResponseHelper.error('Invalid refresh token', null, 401);
      }
      const access_token = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '6h' });
      return ResponseHelper.success('Token refreshed successfully', access_token);
    } catch (error) {
      return ResponseHelper.error('Failed to refresh token', error.message, 500);
    }
  }
}