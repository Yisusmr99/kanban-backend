import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '../entities/comment.entity';
import { Card } from '../entities/card.entity';
import { User } from '../entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { Project } from 'src/entities/project.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Card, User, Project])],
    controllers: [CommentsController],
    providers: [CommentsService,EmailService],
    exports: [CommentsService, EmailService],
})
export class CommentsModule {}
