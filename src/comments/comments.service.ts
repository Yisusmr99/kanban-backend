import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Card } from '../entities/card.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
        @InjectRepository(Card)
        private readonly cardsRepository: Repository<Card>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    // Add a comment to a card
    async addComment(cardId: number, userId: number, content: string): Promise<Comment> {
        const card = await this.cardsRepository.findOne({ where: { id: cardId } });
        if (!card) throw new NotFoundException('Card not found');

        const user = await this.usersRepository.findOne({ where: { id: userId } });

        const newComment = this.commentsRepository.create({
            content,
            card,
            user
        });

        return this.commentsRepository.save(newComment);
    }

    // Get all comments for a specific card
    async getComments(cardId: number): Promise<Comment[]> {
        const card = await this.cardsRepository.findOne({ where: { id: cardId } });
        if (!card) throw new NotFoundException('Card not found');

        return this.commentsRepository.find({
            where: { card: { id: cardId } },
            relations: ['user'],
        });
    }
}
