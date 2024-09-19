import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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
    const thisEmailWasVerified = await this.userService.findOneByEmail(email);

    if (thisEmailWasVerified) {
      if (!thisEmailWasVerified.emailVerified) {
        const existingCode = await this.emailService.findOneByEmail(email);

        if (!existingCode) {
          await this.emailService.sendEmailCode(email, false);
          return {
            notFound: true,
            codeIsInvalid: false,
            credentialsIsInvalid: false,
            codeExpired: false,
            emailNotVerified: false,
          };
        }
      }
    }
    if (code) {
      user = await this.emailService.verifyEmail(email, parseInt(code));

      if (user.invalidCode) {
        return {
          codeIsInvalid: true,
          credentialsIsInvalid: false,
          codeExpired: false,
          emailNotVerified: false,
          NotFound: false,
        };
      } else if (user.codeExpired) {
        return {
          codeExpired: true,
          codeIsInvalid: false,
          credentialsIsInvalid: false,
          emailNotVerified: false,
          notFound: false,
        };
      }
    }

    if (!user.emailVerified) {
      return {
        codeExpired: false,
        codeIsInvalid: false,
        credentialsIsInvalid: false,
        emailNotVerified: true,
        notFound: false,
      };
    }

    const data = {
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      role: user.role,
      id: user.id,
    };

    return {
      data: {
        access_token: this.jwtService.sign(data),
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
      emailNotVerified: !user.emailVerified,
      codeIsInvalid: false,
      codeExpired: false,
      credentialsIsInvalid: false,
      notFound: false,
    };
  }
}
