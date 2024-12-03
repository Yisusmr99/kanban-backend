import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() body: { to: string; subject: string; content: string }) {
    const { to, subject, content } = body;
    const result = await this.emailService.sendEmail(to, subject, content);
    return { message: 'Correo enviado exitosamente', result };
  }
}
