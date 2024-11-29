import { Controller, Post, Body, Get, Param, 
    UseGuards, Request, Put, Delete 
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createProject(
        @Body() body: { name: string, description: string, users: number[] },
        @Request() req
    ) {
        const ownerId = req.user.userId;
        return this.projectsService.createProject(body.name, body.description, ownerId, body.users);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserProjects(@Request() req) {
        const userId = req.user.userId;
        console.log(userId, 'id del usuario get');
        return this.projectsService.getUserProjects(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getProject(@Param('id') id: number) {
        console.log(id, 'id del proyecto');
        return this.projectsService.getProject(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateProject(
        @Param('id') id: number,
        @Body() body: { name: string; description: string; users: number[] },
        @Request() req,
    ) {
        const userId = req.user.userId; // ID del usuario autenticado
        return this.projectsService.updateProject(id, body.name, body.description, body.users, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteProject(@Param('id') id: number, @Request() req) {
        return this.projectsService.softDeleteProject(id);
    }
}