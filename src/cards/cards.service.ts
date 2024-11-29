import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../entities/card.entity';
import { KanbanColumn } from '../entities/column.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(KanbanColumn)
    private readonly columnRepository: Repository<KanbanColumn>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCard(
    columnId: number,
    title: string,
    description?: string,
    responsibleId?: number,
  ) {
    const column = await this.columnRepository.findOne({ where: { id: columnId } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const responsible = responsibleId
      ? await this.userRepository.findOne({ where: { id: responsibleId } })
      : null;

    const card = this.cardRepository.create({
      title,
      description,
      column,
      responsible,
    });

    return this.cardRepository.save(card);
  }

  async updateCard(
    id: number,
    title?: string,
    description?: string,
    columnId?: number,
    responsibleId?: number,
  ) {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (title) card.title = title;
    if (description) card.description = description;

    if (columnId) {
      const column = await this.columnRepository.findOne({ where: { id: columnId } });
      if (!column) {
        throw new NotFoundException('Column not found');
      }
      card.column = column;
    }

    if (responsibleId) {
      const responsible = await this.userRepository.findOne({ where: { id: responsibleId } });
      if (!responsible) {
        throw new NotFoundException('Responsible user not found');
      }
      card.responsible = responsible;
    }

    return this.cardRepository.save(card);
  }
}