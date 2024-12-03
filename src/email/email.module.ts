import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [HttpModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}