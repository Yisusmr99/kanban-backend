import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../entities/card.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { ResponseHelper } from 'src/utils/response.helper';

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(Card)
        private readonly cardsRepository: Repository<Card>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ){}

    async countUsers(){
        const users = await this.usersRepository.count({
            where: { isActive: true },
        })
        return users;
    }

    async projectSumary(){
        
        const projects = await this.projectRepository.createQueryBuilder('project')
        .select(['project.id', 'project.name', 'project.description', 'project.created_at', 'project.deleted_at'])
        .leftJoin('project.owner', 'owner') // Cambia a `leftJoin`
        .addSelect(['owner.id', 'owner.username', 'owner.full_name']) // Selecciona campos específicos de 'owner'
        .leftJoin('project.collaborators', 'collaborator') // Cambia a `leftJoin`
        .addSelect(['collaborator.id', 'collaborator.username', 'collaborator.full_name']) // Selecciona campos específicos de 'collaborators'
        .leftJoin('project.cards', 'card') // Relación con las tarjetas (cards)
        .addSelect(['card.id', 'card.title', 'card.description']) // Campos específicos de las tarjetas
        .leftJoin('card.column', 'column') 
        .addSelect(['column.id', 'column.name'])
        .leftJoin('card.responsible', 'responsible') 
        .addSelect(['responsible.id', 'responsible.username', 'responsible.full_name'])
        .getMany();

        return projects;
    }

}