import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { UtilityService } from 'src/utility/Utility.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly utilityService: UtilityService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string, code: string | null) {
    let user = await this.validateUser(email, password);

    if (!user) {
      return { credentialsIsInvalid: true };
    }

    if (code) {
      user = await this.emailService.verifyEmail(email, parseInt(code));
      if (user.invalidCode) {
        return {
          codeIsInvalid: true,
          credentialsIsInvalid: false,
          codeExpired: false,
          emailNotVerified: false,
        };
      } else if (user.codeExpired) {
        return {
          codeExpired: true,
          codeIsInvalid: false,
          credentialsIsInvalid: false,
          emailNotVerified: false,
        };
      }
    }

    if (!user.emailVerified) {
      return {
        codeExpired: false,
        codeIsInvalid: false,
        credentialsIsInvalid: false,
        emailNotVerified: true,
      };
    }

    const data = {
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      logo: user.logo,
      cover: user.cover,
    };

    return {
      data: { access_token: this.jwtService.sign(data), data },
      emailNotVerified: !user.emailVerified,
      codeIsInvalid: false,
      codeExpired: false,
      credentialsIsInvalid: false,
    };
  }
}
