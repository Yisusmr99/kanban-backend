import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { KanbanColumn } from '../entities/column.entity';
import { ResponseHelper } from 'src/utils/response.helper';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(KanbanColumn)
    private readonly columnRepository: Repository<KanbanColumn>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getColumnsByProject() {
    const column = await this.columnRepository.find({
      relations: ['cards', 'cards.responsible'],
      order: { position: 'ASC' },
    });

    return ResponseHelper.success('Columns retrieved successfully', column);
  }
}