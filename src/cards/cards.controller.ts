import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  createCard(@Body() body: { columnId: number; projectId: number; title: string; description?: string; responsibleId?: number }) {
    return this.cardsService.createCard(body.columnId, body.projectId, body.title, body.description, body.responsibleId);
  }

  @Get('project/:projectId')
  async getCardsByProject(@Param('projectId') projectId: number) {
    const cards = await this.cardsService.getCardsByProject(projectId);
    return cards;
  }

  @Put(':id')
  async updateCardColumn(
    @Param('id') id: number,
    @Body() body: { columnId: number },
  ) {
    return this.cardsService.updateCardColumn(id, body.columnId);
  }

  @Put('update-card/:id')
  editCard(
    @Param('id') cardId: number,
    @Body() body: { columnId: number; projectId: number; title: string; description?: string; responsibleId?: number },
  ) {
    return this.cardsService.editCard(
      cardId,
      body.columnId,
      body.projectId,
      body.title,
      body.description,
      body.responsibleId,
    );
  }

}
