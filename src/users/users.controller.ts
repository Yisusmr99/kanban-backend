import { Controller, UseGuards, Get, Res, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseHelper } from 'src/utils/response.helper';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async getUsers(@Request() req) {
        return ResponseHelper.success('Users retrieved successfully', await this.usersService.getUsers());
    }
}
