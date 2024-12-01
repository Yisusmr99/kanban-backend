import { Controller, Post, Body, Get, Param, 
    UseGuards, Request, Put, Delete 
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Post()
    async createProject(
        @Body() body: { name: string, description: string, users: number[] },
        @Request() req
    ) {
        const ownerId = req.user.userId;
        return this.projectsService.createProject(body.name, body.description, ownerId, body.users);
    }

    @Get()
    async getUserProjects(@Request() req) {
        const userId = req.user.userId;
        return this.projectsService.getUserProjects(userId);
    }

    @Get(':id')
    async getProject(@Param('id') id: number) {
        return this.projectsService.getProject(id);
    }

    @Put(':id')
    async updateProject(
        @Param('id') id: number,
        @Body() body: { name: string; description: string; users: number[] },
        @Request() req,
    ) {
        const userId = req.user.userId; // ID del usuario autenticado
        return this.projectsService.updateProject(id, body.name, body.description, body.users, userId);
    }

    @Delete(':id')
    async deleteProject(@Param('id') id: number, @Request() req) {
        return this.projectsService.softDeleteProject(id);
    }
}