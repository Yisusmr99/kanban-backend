import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly apiUrl = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`;

  async sendEmail(to: string, subject: string, htmlContent: string) {
    try {
      const response = await axios.post(
        this.apiUrl,
        new URLSearchParams({
          from: `Pruebas Mailgun <mailgun@${process.env.MAILGUN_DOMAIN}>`, // Remitente
          to, // Destinatario
          subject, // Asunto
          html: htmlContent, // Contenido HTML
        }),
        {
          auth: {
            username: 'api',
            password: process.env.MAILGUN_API_TOKEN,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error enviando correo:', error.response?.data || error.message);
      throw new Error('No se pudo enviar el correo');
    }
  }

  private getTemplate(templateName: string): string {
    const baseDir = __dirname.includes('/dist/')
      ? path.join(__dirname, '../../src/email/template')
      : path.join(__dirname, './templates');

    const templatePath = path.join(baseDir, `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`La plantilla no se encontró: ${templatePath}`);
    }

    return fs.readFileSync(templatePath, 'utf-8');
  }

  async sendNotificationEmail(to: string, data: any, template: string) {
    let htmlContent; 
    let subject;
    if(template === 'new-task') {
        htmlContent = this.getTemplate('create-task');
        // Reemplazar las variables dinámicas
        htmlContent = htmlContent
        .replace('{{user_name}}', data.user_name)
        .replace('{{task}}', data.task)
        .replace('{{description}}', data.description)
        .replace('{{projectName}}', data.projectName);
        subject = 'Nueva tarea asignada';
    }

    if(template === 'task-commented'){
        htmlContent = this.getTemplate('add-comment');
        htmlContent = htmlContent
        .replace('{{user_name}}', data.user_name)
        .replace('{{task}}', data.task)
        .replace('{{description}}', data.description)
        .replace('{{projectName}}', data.projectName);
        subject = 'Nuevo comentario en tarea';
    }

    if(template === 'change-status'){
        htmlContent = this.getTemplate('change-status');
        htmlContent = htmlContent
        .replace('{{user_name}}', data.user_name)
        .replace('{{previus_state}}', data.previus_state)
        .replace('{{new_state}}', data.new_state)
        .replace('{{task}}', data.task)
        .replace('{{description}}', data.description)
        .replace('{{projectName}}', data.projectName);
        subject = 'Estado de tarea actualizado';
    }

   
    // Enviar el correo usando Mailgun
    try {
      const response = await axios.post(
        this.apiUrl,
        new URLSearchParams({
          from: `Notificaciones Kanban <mailgun@${process.env.MAILGUN_DOMAIN}>`,
          to,
          subject: subject,
          html: htmlContent,
        }),
        {
          auth: {
            username: 'api',
            password: process.env.MAILGUN_API_TOKEN,
          },
        },
      );

    } catch (error) {
      console.error('Error enviando correo:', error.response?.data || error.message);
      throw new Error('No se pudo enviar el correo');
    }
  }
}