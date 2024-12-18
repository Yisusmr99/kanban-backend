import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card } from 'src/entities/card.entity';
import { KanbanColumn } from 'src/entities/column.entity';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card, KanbanColumn, User, Project])],
  controllers: [CardsController],
  providers: [CardsService, EmailService],
  exports: [CardsService, EmailService],
})
export class CardsModule {}
