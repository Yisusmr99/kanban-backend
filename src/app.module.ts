import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username : 'root',
      password : '',
      database : 'kanban',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
