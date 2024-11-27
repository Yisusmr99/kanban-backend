import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResponseHelper } from '../utils/response.helper'; // Asegúrate de importar correctamente

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      const data = {
        access_token: this.jwtService.sign(payload),
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
}