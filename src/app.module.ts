import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { KanbanColumn } from './entities/column.entity';
import { Card } from './entities/card.entity';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      host: process.env.DATABASE_HOST,
      // port: parseInt(process.env.DATABASE_PORT, 10) || 3007,
      username: process.env.DATABASE_USER ?? 'root',
      password: process.env.DATABASE_PASSWORD ?? '',
      database: process.env.DATABASE_NAME ?? 'kanban',
      entities: [User, Project, KanbanColumn, Card],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    ColumnsModule,
    CardsModule,
    CommentsModule,
    EmailModule,
    DashboardModule,
  ]
})
export class AppModule {}
