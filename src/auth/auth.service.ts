import { UtilityService } from 'src/utility/Utility.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly loggingService: LoggingService,
    private readonly utilityService: UtilityService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      if (await this.utilityService.checkPassword(pass, user.password)) {
        this.loggingService.info(``);
        const { password, ...result } = user;
        return result;
      } else {
        this.loggingService.warning(
          `Validação de credendicias com o e-mail ${email} falhou: senha incorreta.`,
        );
      }
    } else {
      this.loggingService.warning(
        `Validação de credendicias com o e-mail ${email} falhou: usuário não encontrado.`,
      );
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
          await this.emailService.sendEmailCode(email, 'CONFIRM_EMAIL');
          this.loggingService.warning(
            `Código de verificação para o email ${email} não encontrado. Um novo código será enviado.`,
          );

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
      user = await this.emailService.verifyEmail(
        email,
        parseInt(code),
        'CONFIRM_EMAIL',
      );

      if (user.invalidCode) {
        this.loggingService.warning(
          `Código de verificação ${code} inválido para o e-mail ${email}`,
        );
        return {
          codeIsInvalid: true,
          credentialsIsInvalid: false,
          codeExpired: false,
          emailNotVerified: false,
          NotFound: false,
        };
      } else if (user.codeExpired) {
        this.loggingService.warning(
          `Código de verificação ${code} expirado para o e-mail ${email}`,
        );
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
      this.loggingService.warning(
        `Tentativa de login com o e-mail ${email} falhou: E-mail não verificado `,
      );
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
      providerId: user.provider ? user.provider.id : null,
    };

    this.loggingService.info(
      `Login bem-sucedido para o usuário de id ${this.utilityService.bufferToUuid(user.id)}`,
    );

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
          business: user.provider
            ? {
                name: user.provider?.businessName,
                document: user.provider?.document,
                about: user.provider?.about,
                category: user.provider?.category,
                url: user.provider?.url,
                rating: user.provider?.rating,
                logo: user.provider?.logo,
                cover: user.provider?.cover,
                hasAutomaticUpdate: user.provider?.hasAutomaticUpdate,
                phoneNumberCommercial: user.provider?.phone_number_commercial,
                street: user.provider?.street,
                number: user.provider?.number,
                complement: user.provider?.complement,
                reference: user?.provider?.reference,
                neighborhood: user?.provider?.neighborhood,
                city: user?.provider?.city,
                state: user?.provider?.state,
                postalCode: user?.provider?.postal_code,
              }
            : null,
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
