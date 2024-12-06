import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Card } from '../entities/card.entity';
import { User } from '../entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { Project } from '../entities/project.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
        @InjectRepository(Card)
        private readonly cardsRepository: Repository<Card>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly emailService: EmailService, // Inyecta el servicio de correo
    ) {}

    // Add a comment to a card
    async addComment(cardId: number, userId: number, content: string): Promise<Comment> {
        // Verificar si la tarjeta existe
        const card = await this.cardsRepository.findOne({
            where: { id: cardId },
            relations: ['project', 'responsible'], // Cargar el proyecto relacionado
        });
        if (!card) throw new NotFoundException('Card not found');
    
        // Verificar si el usuario existe
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        // Crear el nuevo comentario
        const newComment = this.commentsRepository.create({
            content,
            card,
            user,
        });
    
        const savedComment = await this.commentsRepository.save(newComment);
    
        // Obtener el proyecto asociado y sus usuarios (dueño y colaboradores)
        const project = await this.projectRepository.findOne({
            where: { id: card.project.id },
            relations: ['owner', 'collaborators'], // Cargar dueño y colaboradores
        });
        if (!project) throw new NotFoundException('Project not found');
    
        // Combinar los destinatarios (dueño + colaboradores)
        const recipients = [project.owner, card.responsible];
        // Filtrar duplicados y excluir al usuario que comentó
        const uniqueRecipients = recipients.filter(
            (recipient, index, self) =>
                recipient && // Verifica que el destinatario no sea nulo
                recipient.id !== user.id && // Excluye al usuario que comentó
                self.findIndex((r) => r.id === recipient.id) === index, // Evita duplicados
        );
    
        // Enviar notificaciones por correo
        for (const recipient of uniqueRecipients) {
            if (recipient.email) {
                try {
                    await this.emailService.sendNotificationEmail(recipient.email, {
                        task: card.title,
                        description: content,
                        user_name: user.full_name,
                        projectName: project.name,
                    }, 'task-commented');
                } catch (error) {
                    console.error(`Error enviando correo a ${recipient.email}:`, error.message);
                }
            }
        }
    
        return savedComment;
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
