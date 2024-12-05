import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Card } from 'src/entities/card.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Card, User, Project])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
