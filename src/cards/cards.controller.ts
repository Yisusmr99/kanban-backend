import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  createCard(@Body() body: { columnId: number; projectId: number; title: string; description?: string; responsibleId?: number }) {
    return this.cardsService.createCard(body.columnId, body.projectId, body.title, body.description, body.responsibleId);
  }

  @Get('project/:projectId')
  async getCardsByProject(@Param('projectId') projectId: number) {
    return this.cardsService.getCardsByProject(projectId);
  }

  @Put(':id')
  async updateCardColumn(
    @Param('id') id: number,
    @Body() body: { columnId: number },
  ) {
    return this.cardsService.updateCardColumn(id, body.columnId);
  }
}
