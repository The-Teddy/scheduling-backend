import { EmailService } from 'src/email/email.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UtilityService } from 'src/utility/Utility.service';
import { CreateUserDto } from './create.user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly utilityService: UtilityService,
  ) {}

  @Post('create')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ): Promise<any> {
    try {
      await this.userService.create(createUserDto);

      await this.emailService.sendEmailCode(createUserDto.email, false);
      return response.sendStatus(200);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: error.message });
    }
  }
}
