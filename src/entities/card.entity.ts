import { Entity, Column as TableColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { KanbanColumn } from './column.entity';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Comment } from './comment.entity';
import { table } from 'console';

@Entity('cards')
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @TableColumn()
    title: string;

    @TableColumn({ nullable: true })
    description: string;

    @ManyToOne(() => KanbanColumn, (column) => column.cards, { onDelete: 'CASCADE' })
    column: KanbanColumn;

    @ManyToOne(() => User, { nullable: true }) // Optional responsible user
    responsible: User;

    @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
    project: Project;

    @OneToMany(() => Comment, (comment) => comment.card, { cascade: true })
    comments: Comment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @TableColumn()
    projectId: number;
}