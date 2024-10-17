import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { EmailEntity } from '../database/entities/email.entity';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/database/entities/user.entity';
import { UtilityService } from 'src/utility/Utility.service';
import {
  BooleanObject,
  VerifyAndSendEmailCodeInterface,
} from 'src/interfaces/interfaces';
import { LoggingService } from 'src/logging/logging.service';
import { EmailUserDto } from './email.user.dto';

@Injectable()
export class EmailService {
  constructor(
    @Inject('EMAIL_REPOSITORY')
    private readonly emailRepository: Repository<EmailEntity>,
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly utilityService: UtilityService,
    private readonly loggingService: LoggingService,
  ) {}

  async verifyEmail(
    email: string,
    code: number,
    subject: 'CHANGE_PASSWORD' | 'CHANGE_EMAIL' | 'CONFIRM_EMAIL',
  ): Promise<
    UserEntity | BooleanObject<'codeExpired'> | BooleanObject<'invalidCode'>
  > {
    //verifica a existência do código e se ele pertence ao email fornecido
    const codeAndEmail = await this.emailRepository.findOne({
      where: {
        email,
        code,
      },
    });
    //verifica a existência do email e do código na base de dados
    if (codeAndEmail) {
      //verifica se o código expirou
      if (this.utilityService.hasExpired(codeAndEmail.createdAt)) {
        //caso tenha expirado, remove o código
        await this.emailRepository.remove(codeAndEmail);
        //aqui ela envia outro código
        await this.sendEmailCode(email, subject);
        return {
          codeExpired: true,
          invalidCode: false,
        };
      }
      //caso o código seja válido e não tenha expirado, remove e verifica o email do usuário
      await this.emailRepository.remove(codeAndEmail);
      return await this.userService.verifyEmailUser(email);
    }

    return { codeExpired: false, invalidCode: true };
  }

  async sendEmailCode(
    email: string,
    subject: 'CHANGE_PASSWORD' | 'CHANGE_EMAIL' | 'CONFIRM_EMAIL',
    oldEmail: string | null = null,
  ) {
    //gera um número aleatório de 6 digitos
    const code = this.utilityService.generateRandomNumbers();
    //cria uma instância da entidade EmailRepository
    const storeCode = this.emailRepository.create({
      email,
      oldEmail,
      code,
    });
    //salva o email e o código na base de dados
    await this.emailRepository.save(storeCode);
    //envia o email

    const subjectEmail =
      subject === 'CONFIRM_EMAIL'
        ? 'Confirmação de E-mail'
        : subject === 'CHANGE_PASSWORD'
          ? 'Recuperação de senha'
          : 'Alteração de Email';

    await this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_FROM,
      subject: subjectEmail,
      text: code.toString(),
      html: `
      <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Código de ${subjectEmail}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 20px;
        }
        .button {
            display: inline-block;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            font-size: 14px;
            color: #888888;
            text-align: center;
            padding: 10px;
            border-top: 1px solid #dddddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Seu Código de ${subjectEmail}</h1>
        </div>
        <div class="content">
            <p>Olá,</p>
            <p>Obrigado por utilizar nosso sistema. Aqui está o seu código de ${subjectEmail}</p>
            <p style="font-size: 24px; font-weight: bold;">${code}</p>
            <p>Se você não solicitou este código, por favor ignore este e-mail.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 TeddyDeveloper. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>

      `,
    });
  }
  async verifyAndSendEmailCode(
    email: string,
    code: string | null,
    subject: 'CHANGE_PASSWORD' | 'CHANGE_EMAIL' | 'CONFIRM_EMAIL',
    newEmail?: string,
  ): Promise<VerifyAndSendEmailCodeInterface> {
    const user = await this.userService.findOneByEmail(email);

    //verifica a existência do usuário na base de dados
    if (!user) {
      return {
        userNotFound: true,
        codeExpired: false,
        hasCode: false,
        invalidCode: false,
        differentEmail: false,
      };
    }
    const where = subject === 'CHANGE_EMAIL' ? { oldEmail: email } : { email };
    const existingCode = await this.emailRepository.findOne({
      where: where,
    });

    //verifica a existência do código pelo email fornecido
    if (existingCode) {
      if (existingCode.email !== newEmail.toLowerCase()) {
        return {
          userNotFound: false,
          codeExpired: false,
          hasCode: false,
          invalidCode: false,
          differentEmail: true,
        };
      }
      //verifica se o usuário passou o código
      if (code) {
        //verifica se o código é o mesmo que está na base de dados
        if (existingCode.code !== parseInt(code)) {
          return {
            userNotFound: false,
            codeExpired: false,
            hasCode: false,
            invalidCode: true,
            differentEmail: false,
          };
        }
      }
      //verifica se o código expirou
      if (this.utilityService.hasExpired(existingCode.createdAt)) {
        //caso o código tenha expirado, remove e envia outro
        await this.emailRepository.remove(existingCode);
        await this.sendEmailCode(email, subject);
        return {
          userNotFound: false,
          codeExpired: true,
          hasCode: false,
          invalidCode: false,
          differentEmail: false,
        };
      }

      return {
        userNotFound: false,
        codeExpired: false,
        hasCode: true,
        invalidCode: false,
        differentEmail: false,
      };
    }
    this.loggingService.info(
      `Um novo código de verificação foi enviado para o e-mail ${email}`,
    );
    //um novo código sera enviado caso o email não encotre nenhum código na base de dados
    await this.sendEmailCode(email, subject);
    return {
      userNotFound: false,
      codeExpired: false,
      hasCode: false,
      invalidCode: false,
      differentEmail: false,
    };
  }
  async deleteCodeEmail(email: string, isOldEmail: boolean = false) {
    const where = isOldEmail ? { oldEmail: email } : { email };
    //verifica se o email fornecido está na base de dados
    const hasEmail = await this.emailRepository.findOne({
      where: where,
    });
    //caso esteja, remove o email relativo ao código de verificação
    if (hasEmail) {
      await this.emailRepository.remove(hasEmail);
    }
  }
  async findOneByEmail(email: string): Promise<EmailEntity | null> {
    const existingCode = await this.emailRepository.findOne({
      where: {
        email,
      },
    });
    if (!existingCode) {
      return null;
    }
    return existingCode;
  }
  async verifyOldEmailAndSendEmailCode(
    id: Buffer,
    newEmail: string,
  ): Promise<VerifyAndSendEmailCodeInterface> {
    const user = await this.userService.findOneById(id);

    //verifica a existência do usuário na base de dados
    if (!user) {
      return {
        userNotFound: true,
        codeExpired: false,
        hasCode: false,
        invalidCode: false,
      };
    }
    const existingCode = await this.emailRepository.findOne({
      where: { oldEmail: user.email },
    });
    //verifica a existência do código pelo email fornecido
    if (existingCode) {
      //verifica se o código expirou
      if (this.utilityService.hasExpired(existingCode.createdAt)) {
        //caso o código tenha expirado, remove e envia outro
        await this.emailRepository.remove(existingCode);
        await this.sendEmailCode(newEmail, 'CHANGE_EMAIL', user.email);
        return {
          userNotFound: false,
          codeExpired: true,
          hasCode: false,
          invalidCode: false,
        };
      }

      return {
        userNotFound: false,
        codeExpired: false,
        hasCode: true,
        invalidCode: false,
      };
    }

    //um novo código sera enviado caso o email não encotre nenhum código na base de dados
    await this.sendEmailCode(newEmail, 'CHANGE_EMAIL', user.email);
    this.loggingService.info(
      `Um novo código de verificação foi enviado para o e-mail ${newEmail}`,
    );
    return {
      userNotFound: false,
      codeExpired: false,
      hasCode: false,
      invalidCode: false,
    };
  }
  async sendEmail(email: string, subject: string, text: string, html: string) {
    await this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_FROM,
      subject: subject,
      text: text,
      html: html,
    });
  }
}
