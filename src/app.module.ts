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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username : 'root',
      password : '',
      database : 'kanban',
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
  ]
})
export class AppModule {}
