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
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createCard(
    columnId: number,
    projectId: number,
    title: string,
    description?: string,
    responsibleId?: number,
  ) {
    const column = await this.columnRepository.findOne({ where: { id: columnId } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const responsible = responsibleId
      ? await this.userRepository.findOne({ where: { id: responsibleId } })
      : null;

    const card = this.cardRepository.create({
      title,
      description,
      column,
      project,
      responsible,
    });

    const cardSaved = await this.cardRepository.save(card);

    return {
      statusCode: 201,
      message: 'Card created successfully',
      data: cardSaved,
    };
  }

  async getCardsByProject(projectId: number) {
    // Verificar que el proyecto exista
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Obtener las tarjetas asociadas a las columnas del proyecto
    const cards = await this.cardRepository.find({
      where: { project: { id: projectId } },
      relations: ['column', 'responsible'], // Asegúrate de cargar las relaciones necesarias
    });

    if (!cards.length) {
      throw new NotFoundException('No cards found for this project');
    }

    return {
      statusCode: 200,
      message: 'Cards retrieved successfully',
      data: cards,
    };
  }

  async updateCardColumn(cardId: number, columnId: number): Promise<Card> {
    // Find the card by its ID
    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // Find the column by its ID
    const column = await this.columnRepository.findOne({ where: { id: columnId } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    // Update the card's column
    card.column = column;

    // Save the updated card
    return this.cardRepository.save(card);
  }
}