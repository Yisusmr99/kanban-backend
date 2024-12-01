import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  getColumns() {
    return this.columnsService.getColumnsByProject();
  }
}