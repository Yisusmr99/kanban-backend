import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { KanbanColumn } from '../entities/column.entity';
import { Project } from '../entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KanbanColumn, Project])], // Agrega Project aquí
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}