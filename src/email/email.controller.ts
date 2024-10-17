import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ChangeEmailDTO, EmailUserDto } from './email.user.dto';
import { EmailService } from './email.service';
import { LoggingService } from 'src/logging/logging.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { UtilityService } from 'src/utility/Utility.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly loggingService: LoggingService,
    private readonly utilityService: UtilityService,
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
        emailUserDto.subject,
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

  @UseGuards(JwtAuthGuard)
  @Post('send-code-change-email')
  async sendCodeChangeEmail(
    @Body() body: ChangeEmailDTO,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<any> {
    const user = request.user;
    const { id, email }: any = user;

    if (!user || !id || !id.data) {
      this.loggingService.warning('Usuário não autenticado ou ID inválido');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Usuário não autenticado.' });
    }
    const uuidBuffer = this.utilityService.uuidBuffer(id);
    try {
      if (email === body.email) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'O email fornecido deve ser diferente do atual',
        });
      }
      const remainingTime: any =
        await this.utilityService.verifyRemainingTimeToChangEmail(uuidBuffer);

      if (remainingTime.outTime) {
        return response.status(HttpStatus.ACCEPTED).json({
          message: remainingTime.message,
        });
      }

      const result = await this.emailService.verifyOldEmailAndSendEmailCode(
        uuidBuffer,
        body.email,
      );

      if (result.userNotFound) {
        this.loggingService.warning(
          `Falha no envio do código de verificação para o e-mail ${body.email}. Usuário não encontrado`,
        );
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuário não encontrado' });
      }
      if (result.codeExpired) {
        this.loggingService.info(
          `O código de verificação fornecido para o e-mail ${body.email} expirou. Um novo código foi enviado`,
        );
        return response.status(HttpStatus.OK).json({
          message: 'Código expirado, um novo código foi enviado.',
        });
      }
      if (result.hasCode) {
        this.loggingService.info(
          `Falha no envio do código de verificação para o e-mail ${body.email}. O usuário já tem um código ativo`,
        );
        return response.status(HttpStatus.OK).json({
          message: 'Você já tem um código ativo. Verifique seu email.',
        });
      }

      this.loggingService.info(
        `Código de verificação enviado para o e-mail ${body.email}`,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Código de verificação enviado com sucesso.',
      });
    } catch (error) {
      this.loggingService.error(
        `Erro no envio do código de verificação para o e-mail ${body.email}`,
      );
      throw new HttpException(
        'Erro interno do servidor. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
