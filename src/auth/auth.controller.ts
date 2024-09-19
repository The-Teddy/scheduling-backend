import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthUserDto } from './auth.user.dto';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() authUserDto: AuthUserDto,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const user = await this.authService.login(
        authUserDto.email.toLowerCase(),
        authUserDto.password,
        authUserDto.codeEmail,
      );
      if (user.notFound) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          error: {
            codeExpired: true,
            credentialsIsInvalid: false,
            emailNotVerified: false,
            codeOrEmailInvalid: false,
            message: 'Um novo código foi enviado para seu email.',
          },
        });
      }
      if (user.credentialsIsInvalid) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          error: {
            credentialsIsInvalid: true,
            emailNotVerified: false,
            codeOrEmailInvalid: false,
            codeExpired: false,
            message: 'Credenciais inválidas. Verifique o email e a senha.',
          },
        });
      }
      if (user.codeIsInvalid) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          error: {
            credentialsIsInvalid: false,
            codeOrEmailInvalid: true,
            emailNotVerified: false,
            codeExpired: false,
            message: 'Código inválido.',
          },
        });
      }
      if (user.codeExpired) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          error: {
            credentialsIsInvalid: false,
            codeOrEmailInvalid: false,
            emailNotVerified: false,
            codeExpired: true,
            message: 'Um novo código foi enviado para seu email.',
          },
        });
      }
      if (user.emailNotVerified) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          error: {
            credentialsIsInvalid: false,
            codeOrEmailInvalid: false,
            emailNotVerified: true,
            codeExpired: false,
            message: 'Por favor, verifique seu email antes de continuar.',
          },
        });
      }

      return response
        .status(200)
        .json({ data: user.data, token: user.data.access_token });
    } catch (error) {
      console.error('Erro durante login:', error.message);
      return response.status(500).json({
        message: 'Erro interno do servidor. Tente novamente mais tarde.',
      });
    }
  }
  @Post('change-password')
  async changePassword(
    @Body() authUserDto: AuthUserDto,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const result = await this.emailService.verifyAndSendEmailCode(
        authUserDto.email,
        authUserDto.codeEmail,
      );

      if (result.userNotFound) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
        });
      }
      if (result.codeExpired) {
        return response.status(HttpStatus.OK).json({
          message: 'Código expirado, um novo código foi enviado.',
        });
      }
      if (result.invalidCode) {
        return response.status(HttpStatus.OK).json({
          message: 'Código inválido.',
        });
      }
      if (result.hasCode) {
        const user = await this.userService.updatePassword(
          authUserDto.email,
          authUserDto.password,
        );
        if (user) {
          return response.status(HttpStatus.CREATED).json({
            message: 'senha alterada com sucesso.',
          });
        }
      }

      return response.status(HttpStatus.OK).json({
        message: 'Um novo código foi enviado.',
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro interno do servidor. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
