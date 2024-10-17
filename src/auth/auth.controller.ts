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
import { LoggingService } from 'src/logging/logging.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly loggingService: LoggingService,
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

      const errorResponse = {
        credentialsIsInvalid: false,
        codeOrEmailInvalid: false,
        emailNotVerified: false,
        codeExpired: false,
        message: '',
      };

      if (user.notFound) {
        errorResponse.codeExpired = true;
        errorResponse.message = 'Um novo código foi enviado para seu email.';
      } else if (user.credentialsIsInvalid) {
        errorResponse.credentialsIsInvalid = true;
        errorResponse.message =
          'Credenciais inválidas. Verifique o email e a senha.';
      } else if (user.codeIsInvalid) {
        errorResponse.codeOrEmailInvalid = true;
        errorResponse.message = 'Código inválido.';
      } else if (user.codeExpired) {
        errorResponse.codeExpired = true;
        errorResponse.message = 'Um novo código foi enviado para seu email.';
      } else if (user.emailNotVerified) {
        errorResponse.emailNotVerified = true;
        errorResponse.message =
          'Por favor, verifique seu email antes de continuar.';
      } else {
        return response
          .status(HttpStatus.OK)
          .json({ data: user.data, token: user.data.access_token });
      }

      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: errorResponse });
    } catch (error) {
      this.loggingService.error(
        `Falha no login para o e-mail ${authUserDto.email}: ${error.message}`,
      );
      throw new HttpException(
        'Login falhou. Por favor, tente novamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        'CHANGE_PASSWORD',
      );

      if (result.userNotFound) {
        this.loggingService.warning(
          `Falha durante a alteração de senha do e-mail ${authUserDto.email}: usuário não encontrado.`,
        );
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
        });
      }
      if (result.codeExpired) {
        this.loggingService.warning(
          `Falha durante a alteração de senha do e-mail ${authUserDto.email}: Código expirado. Um novo código foi enviado.`,
        );
        return response.status(HttpStatus.OK).json({
          message: 'Código expirado, um novo código foi enviado.',
        });
      }
      if (result.invalidCode) {
        this.loggingService.warning(
          `Falha durante a alteração de senha do e-mail ${authUserDto.email}: Código inválido.`,
        );
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
          this.loggingService.info(
            `Alteração de senha do e-mail ${authUserDto.email} foi bem sucedida`,
          );
          return response.status(HttpStatus.CREATED).json({
            message: 'Senha alterada com sucesso.',
          });
        } else {
          this.loggingService.warning(
            `Falha durante a alteração de senha do e-mail ${authUserDto.email}: usuário não encontrado.`,
          );
          return response.status(HttpStatus.NOT_FOUND).json({
            message: 'Usuário não encontrado.',
          });
        }
      }

      return response.status(HttpStatus.OK).json({
        message: 'Um novo código foi enviado.',
      });
    } catch (error) {
      this.loggingService.error(
        `Falha alteração de senha para o e-mail ${authUserDto.email}: ${error.message}`,
      );
      throw new HttpException(
        'Falha na alteração de senha. Por favor, tente novamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
