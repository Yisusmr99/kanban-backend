import {
  Entity,
  Column as TableColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Card } from './card.entity';

@Entity('columns')
export class KanbanColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @TableColumn()
  name: string;

  @TableColumn()
  position: number; // Orden de la columna (To Do = 1, In Progress = 2, etc.)

  @OneToMany(() => Card, (card) => card.column, { cascade: true })
  cards: Card[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}