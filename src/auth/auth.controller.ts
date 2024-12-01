import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() body: { email: string, password: string, username: string, fullName: string }) {
        return this.authService.register(body.email, body.password, body.username, body.fullName);
    }

    @Post('login')
    async login(
        @Body() body: { email: string, password: string },
        @Res() res: Response
    ) {
        const result = await this.authService.login(body.email, body.password);

        if (result.statusCode !== 200) {
            // Si hay un error, devuelve la respuesta sin configurar cookies
            return res.status(result.statusCode).json(result);
        }

        if ('data' in result) {
            const { data } = result;
            const { access_token, refresh_token, user } = data;

            // Configurar la cookie con el token JWT
            res.cookie('token', access_token, {
                httpOnly: true, // No accesible desde JavaScript en el navegador
                secure: false, // Solo HTTPS en producción
                sameSite: 'lax', // Prevenir CSRF
                maxAge: 60 * 60 * 1000, // 1 hora
            });

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            });

            // Enviar respuesta al cliente con la información del usuario
            return res.status(200).json({
                message: 'Login successful',
                data: { user },
                statusCode: 200,
            });
        } else {
            return res.status(result.statusCode).json(result);
        }
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false, // Cambia a true si estás usando HTTPS
            sameSite: 'strict', // Configura las reglas de envío de cookies
        });
        return res.status(200).json({
            message: 'Logged out successfully',
        });
    }

    @Post('refresh-token')
    async refreshToken(
        @Res() res: Response, 
        @Req() req: Request & { cookies: { [key: string]: string } }
    ) {
        const refreshToken = req.cookies['refresh_token']; // Obtén el refresh token de las cookies

        const result = await this.authService.refreshToken(refreshToken);

        if (result.statusCode !== 200) {
            return res.status(result.statusCode).json(result);
        }

        if ('data' in result) {
            const { data } = result;
            const { access_token } = data;

            res.cookie('token', access_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000,
            });

            return res.status(200).json({
                message: 'Token refreshed successfully',
                statusCode: 200,
            });
        } else {
            return res.status(result.statusCode).json(result);
        }
    }
}