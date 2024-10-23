import { EmailService } from 'src/email/email.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import {
  CreateUserDTO,
  UpdateDataUserDTO,
  UpdateEmailUserDTO,
  UpdatePasswordDTO,
} from './user.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { LoggingService } from 'src/logging/logging.service';
import { UtilityService } from 'src/utility/Utility.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly loggingService: LoggingService,
    private readonly utilityService: UtilityService,
  ) {}

  @Post('create')
  async create(
    @Body() createUserDto: CreateUserDTO,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const userCreated = await this.userService.create(createUserDto);
      if (!userCreated) {
        this.loggingService.warning(
          `Falha ao criar usuário ${createUserDto.name} em ${new Date().toISOString()}: E-mail ${createUserDto.email} já está em uso`,
        );
        return response
          .status(HttpStatus.CONFLICT)
          .json({ message: 'Este email já esta sendo utilizado.' });
      }

      await this.emailService.sendEmailCode(
        createUserDto.email,
        'CONFIRM_EMAIL',
      );
      this.loggingService.warning(
        `Usuário ${createUserDto.name} criado com sucesso em ${new Date().toISOString()}: um código de verificação foi enviado para o e-mail ${createUserDto.email} `,
      );
      return response.sendStatus(200);
    } catch (error) {
      this.loggingService.error(
        `Falha ao criar usuário ${createUserDto.name} (${createUserDto.email}) em ${new Date().toISOString()}: ${error.message}`,
      );

      throw new HttpException(
        'Falha ao criar usuário. Por favor, tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const user = request.user;
    const { id }: any = user;

    if (!user || !id || !id.data) {
      this.loggingService.warning('Usuário não autenticado ou ID inválido');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Usuário não autenticado.' });
    }
    const uuidBuffer = this.utilityService.uuidBuffer(id);

    try {
      const foundUser = await this.userService.findOneById(uuidBuffer);
      if (!foundUser) {
        this.loggingService.warning(
          `Falha ao listar o usuário de id ${this.utilityService.bufferToUuid(id)} em ${new Date().toISOString()}: Usuário não encontrado`,
        );
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuário não encontrado.' });
      }

      return response.status(200).json({
        data: foundUser,
      });
    } catch (error) {
      this.loggingService.error(
        `Falha ao listar usuário de id ${uuidBuffer}: ${error.message}`,
      );

      throw new HttpException(
        `Falha ao listar usuário. Por favor, tente novamente mais tarde.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put('/update-data')
  @UseGuards(JwtAuthGuard)
  async updateData(
    @Req() request: Request,
    @Res() response: Response,
    @Body() body: UpdateDataUserDTO,
  ): Promise<any> {
    const user = request.user;
    const { id }: any = user;

    if (!user || !id || !id.data) {
      this.loggingService.warning('Usuário não autenticado ou ID inválido');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Usuário não autenticado.' });
    }
    const uuidBuffer = this.utilityService.uuidBuffer(id);
    try {
      const updatedUser = await this.userService.updateDataUser(
        uuidBuffer,
        body,
      );
      if (!updatedUser) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado',
        });
      }
      return response.sendStatus(HttpStatus.OK);
    } catch (error) {
      this.loggingService.error(
        `Falha ao atualizar dados do usuário de id ${uuidBuffer}: ${error.message}`,
      );
      throw new HttpException(
        `Falha ao atualizar dados. Por favor, tente novamente mais tarde.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put('/change-email')
  @UseGuards(JwtAuthGuard)
  async updateEmail(
    @Req() request: Request,
    @Res() response: Response,
    @Body() body: UpdateEmailUserDTO,
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
      const codeValidate = await this.emailService.verifyAndSendEmailCode(
        email,
        body.codeEmail,
        'CHANGE_EMAIL',
        body.email,
      );
      if (codeValidate.differentEmail) {
        this.loggingService.warning(
          `Falha durante a alteração do e-mail ${email}: O e-mail fornecido é diferente do e-mail de verificação.`,
        );
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'O e-mail fornecido é diferente do e-mail de verificação.',
        });
      }
      if (codeValidate.userNotFound) {
        this.loggingService.warning(
          `Falha durante a alteração do e-mail ${email}: usuário não encontrado.`,
        );
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
        });
      }
      if (codeValidate.codeExpired) {
        this.loggingService.warning(
          `Falha durante a alteração do e-mail ${email}: Código expirado. Um novo código foi enviado.`,
        );
        return response.status(HttpStatus.OK).json({
          message: 'Código expirado, um novo código foi enviado.',
        });
      }
      if (codeValidate.invalidCode) {
        this.loggingService.warning(
          `Falha durante a alteração do e-mail ${email}: Código inválido.`,
        );
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Código inválido.',
        });
      }
      if (codeValidate.hasCode) {
        const updatedUser: any = await this.userService.updateEmailUser(
          uuidBuffer,
          body,
        );

        if (updatedUser.userNotFound) {
          return response.status(HttpStatus.NOT_FOUND).json({
            message: 'Usuário não encontrado',
          });
        }
        if (updatedUser.outTime) {
          const formatedTime: any = this.utilityService.formatTimeOrDays(
            updatedUser.remainingTime,
          );
          const messageRemainingTime = this.utilityService.formatTimeInText(
            'Você poderá alterar seu e-mail novamente em',
            formatedTime,
          );

          return response.status(HttpStatus.ACCEPTED).json({
            message: messageRemainingTime,
          });
        }
        if (updatedUser.credentialsIsInvalid) {
          return response.status(HttpStatus.UNAUTHORIZED).json({
            message: 'Senha inválida',
          });
        }
        this.emailService.deleteCodeEmail(email, true);
        return response.status(HttpStatus.CREATED).json({
          message:
            'Email alterado com sucesso!! Faça o login novamente para continuar.',
        });
      }
      return response.status(HttpStatus.OK).json({
        message: 'Um novo código foi enviado.',
      });
    } catch (error) {
      this.loggingService.error(
        `Falha ao atualizar E-mail do usuário de id ${uuidBuffer}: ${error.message}`,
      );
      throw new HttpException(
        `Falha ao atualizar E-mail. Por favor, tente novamente mais tarde.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put('/change-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Req() request: Request,
    @Res() response: Response,
    @Body() body: UpdatePasswordDTO,
  ): Promise<any> {
    const user = request.user;
    const { id }: any = user;

    if (!user || !id || !id.data) {
      this.loggingService.warning('Usuário não autenticado ou ID inválido');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Usuário não autenticado.' });
    }
    const uuidBuffer = this.utilityService.uuidBuffer(id);
    try {
      const updatedUser: any = await this.userService.updatePassword(
        uuidBuffer,
        body,
      );

      if (updatedUser.userNotFound) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado',
        });
      }
      if (updatedUser.credentialsIsInvalid) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Credenciais inválidas. Verifique a senha.',
        });
      }

      return response.sendStatus(200);
    } catch (error) {
      this.loggingService.error(
        `Falha ao atualizar Senha do usuário de id ${uuidBuffer}: ${error.message}`,
      );
      throw new HttpException(
        'Falha ao atualizar senha. Por favor, tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
