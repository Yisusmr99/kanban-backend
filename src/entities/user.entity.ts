import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, DeleteDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { Card } from './card.entity';
import { Comment } from './comment.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    full_name: string;

    @Column()
    password: string;
    
    @Column({ default: null })
    refresh_token: string;

    @Column({ default: true })
    isActive: boolean;

    // Relation with projects owned by the user
    @OneToMany(() => Project, (project) => project.owner)
    ownedProjects: Project[];

    // Relation with projects where the user collaborates
    @ManyToMany(() => Project, (project) => project.collaborators)
    projects: Project[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => Card, (card) => card.responsible)
    cards: Card[];

    // Relation with comments made by the user (optional)
    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
}