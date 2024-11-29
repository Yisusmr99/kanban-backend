import { Controller, Post, Put, Body, Param } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  createCard(@Body() body: { columnId: number; title: string; description?: string; responsibleId?: number }) {
    return this.cardsService.createCard(body.columnId, body.title, body.description, body.responsibleId);
  }

  @Put(':id')
  updateCard(@Param('id') id: number, @Body() body: { title?: string; description?: string; columnId?: number; responsibleId?: number }) {
    return this.cardsService.updateCard(id, body.title, body.description, body.columnId, body.responsibleId);
  }
}