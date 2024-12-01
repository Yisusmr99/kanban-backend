import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    async addComment(
        @Param('taskId') taskId: number,
        @Request() req,
        @Body() body: { content: string }
    ) {
        const userId = req.user.userId;
        return this.commentsService.addComment(taskId, userId, body.content);
    }

    @Get()
    async getComments(@Param('taskId') taskId: number) {
        return this.commentsService.getComments(taskId);
    }
}