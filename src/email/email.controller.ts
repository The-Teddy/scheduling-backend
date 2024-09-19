import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailUserDto } from 'src/auth/email.user.dto';
import { EmailService } from './email.service';
import { LoggingService } from 'src/logging/logging.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post('send-code')
  async sendCode(
    @Body() emailUserDto: EmailUserDto,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const result = await this.emailService.verifyAndSendEmailCode(
        emailUserDto.email,
        null,
      );
      if (result.userNotFound) {
        this.loggingService.warning(
          `Falha no envio do código de verificação para o e-mail ${emailUserDto.email}. Usuário não encontrado`,
        );
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuário não encontrado' });
      }
      if (result.codeExpired) {
        this.loggingService.info(
          `O código de verificação fornecido para o e-mail ${emailUserDto.email} expirou. Um novo código foi enviado`,
        );
        return response.status(HttpStatus.OK).json({
          message: 'Código expirado, um novo código foi enviado.',
        });
      }
      if (result.hasCode) {
        this.loggingService.info(
          `Falha no envio do código de verificação para o e-mail ${emailUserDto.email}. O usuário já tem um código ativo`,
        );
        return response.status(HttpStatus.OK).json({
          message: 'Você já tem um código ativo. Verifique seu email.',
        });
      }

      this.loggingService.info(
        `Código de verificação enviado para o e-mail ${emailUserDto.email}`,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Código de verificação enviado com sucesso.',
      });
    } catch (error) {
      this.loggingService.error(
        `Erro no envio do código de verificação para o e-mail ${emailUserDto.email}`,
      );
      throw new HttpException(
        'Erro interno do servidor. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
