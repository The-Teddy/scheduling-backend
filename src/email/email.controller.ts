import {
  Controller,
  Post,
  Req,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailUserDto } from 'src/auth/email.user.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

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
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuário não encontrado' });
      }
      if (result.codeExpired) {
        return response.status(HttpStatus.OK).json({
          message: 'Código expirado, um novo código foi enviado.',
        });
      }
      if (result.hasCode) {
        return response.status(HttpStatus.OK).json({
          message: 'Você já tem um código ativo. Verifique seu email.',
        });
      }

      return response.status(HttpStatus.OK).json({
        message: 'Código de verificação enviado com sucesso.',
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
