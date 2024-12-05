import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { ResponseHelper } from 'src/utils/response.helper';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) {}

    @Get()
    async getDashboard(@Request() req) {
        const user = req.user;
    
        const total_users = await this.dashboardService.countUsers();
        const projects = await this.dashboardService.projectSumary();
    
        let total_tasks = 0;
        const data_projects = [];
    
        projects.forEach(project => {
            total_tasks += project.cards.length;
    
            // Crear un objeto para contar las tarjetas por responsable dentro del proyecto
            const taskCountByResponsible = {};
    
            // Contar las tarjetas asignadas a cada responsable
            project.cards.forEach(card => {
                const responsibleId = card.responsible.id;
                const responsibleName = card.responsible.full_name;
                const responsibleUsername = card.responsible.username;
    
                if (!taskCountByResponsible[responsibleId]) {
                    taskCountByResponsible[responsibleId] = {
                        id: responsibleId,
                        fullName: responsibleName,
                        username: responsibleUsername,
                        cardCount: 0,
                    };
                }
    
                taskCountByResponsible[responsibleId].cardCount += 1;
            });
    
            // Convertir el objeto de contadores a un array
            const taskSummaryByResponsible = Object.values(taskCountByResponsible);
    
            // Agregar datos específicos del proyecto
            const data = {
                id: project.id,
                name: project.name,
                description: project.description,
                count_tasks: project.cards.length,
                porcentage_tasks: project.cards.length > 0 ? (project.cards.filter(card => card.column.name === 'Done').length / project.cards.length) * 100 : 0,
                owner: project.owner.full_name,
                collaborators: project.collaborators.length,
                created_at: project.created_at,
                deleted_at: project.deleted_at,
                count_tasks_todo: project.cards.filter(card => card.column.name === 'To Do').length,
                count_tasks_inprogress: project.cards.filter(card => card.column.name === 'In Progress').length,
                count_tasks_done: project.cards.filter(card => card.column.name === 'Done').length,
                tasks_by_responsible: taskSummaryByResponsible, // Resumen por responsable para este proyecto
            };
    
            data_projects.push(data);
        });
    
        const data = {
            count_users: total_users,
            count_projects: projects.length,
            count_tasks: total_tasks,
            summary_projects: data_projects,
        };
    
        return data;
    }

}