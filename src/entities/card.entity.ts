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

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @TableColumn()
  title: string;

  @TableColumn({ nullable: true })
  description: string;

  // Asociación con las columnas globales
  @ManyToOne(() => KanbanColumn, (column) => column.cards, {
    onDelete: 'CASCADE', // Cuando se elimina una columna, las tarjetas asociadas también se eliminan
  })
  column: KanbanColumn;

  // Responsable de la tarjeta (opcional)
  @ManyToOne(() => User, { nullable: true })
  responsible: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
