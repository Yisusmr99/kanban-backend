import {
  Entity,
  Column as TableColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KanbanColumn } from './column.entity';
import { User } from './user.entity';
import { Project } from './project.entity';

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

  @ManyToOne(() => User, { nullable: true }) // Responsable opcional
  responsible: User;

  @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
  project: Project;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}