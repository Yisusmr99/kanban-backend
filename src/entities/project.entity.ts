import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.ownedProjects, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable({
    name: 'user_projects', // Nombre personalizado de la tabla de unión
    joinColumn: {
      name: 'project_id', // Nombre de la columna que referencia a la tabla Project
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id', // Nombre de la columna que referencia a la tabla User
      referencedColumnName: 'id',
    },
  })
  collaborators: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}