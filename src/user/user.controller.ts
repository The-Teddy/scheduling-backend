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
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './create.user.dto';
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
    @Body() createUserDto: CreateUserDto,
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

      await this.emailService.sendEmailCode(createUserDto.email, false);
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
    const uuidBuffer = Buffer.from(id.data);

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
        data: {
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          emailVerified: foundUser.emailVerified,
          isActive: foundUser.isActive,
          createdAt: foundUser.createdAt,
        },
      });
    } catch (error) {
      this.loggingService.error(
        `Falha ao listar usuário de id ${uuidBuffer} em ${new Date().toISOString()}: ${error.message}`,
      );

      throw new HttpException(
        `Falha ao listar usuário. Por favor, tente novamente mais tarde.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
