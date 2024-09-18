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

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Post('create')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const userCreated = await this.userService.create(createUserDto);
      if (!userCreated) {
        return response
          .status(HttpStatus.CONFLICT)
          .json({ message: 'Este email já esta sendo utilizado.' });
      }

      await this.emailService.sendEmailCode(createUserDto.email, false);
      return response.sendStatus(200);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Um erro interno ocorreu... Tente novamente mais tarde.',
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
    try {
      const { id }: any = request.user;
      const uuidBuffer = Buffer.from(id.data);

      const user = await this.userService.findOneById(uuidBuffer);
      if (!user) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuário não encontrado.' });
      }

      return response.status(200).json({
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error(error);

      throw new HttpException(
        'Um erro interno ocorreu... Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
