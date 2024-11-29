import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, 
    UpdateDateColumn, OneToMany, ManyToMany, DeleteDateColumn
} from "typeorm";
import { Project } from "./project.entity";
import { Card } from "./card.entity";

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

    @Column({ default: true})
    isActive: boolean;

    // Relación con los proyectos que este usuario posee
    @OneToMany(() => Project, (project) => project.owner)
    ownedProjects: Project[];

    // Relación con los proyectos en los que este usuario colabora
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
}
