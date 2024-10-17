import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import {
  CreateUserDTO,
  UpdateDataUserDTO,
  UpdateEmailUserDTO,
} from './user.dto';
import { hashSync as encrypt } from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { LoggingService } from 'src/logging/logging.service';
import { UtilityService } from 'src/utility/Utility.service';
import {
  BooleanObject,
  NumberObject,
  UserInterface,
} from 'src/interfaces/interfaces';
import { FieldchangeLogService } from 'src/field_change_log/field_change_log.service';
import { AuthService } from 'src/auth/auth.service';
import { timeToWaitInHours } from 'src/global/globalVariablesAndConstants';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
    private readonly loggingService: LoggingService,
    private readonly utilityService: UtilityService,
    private readonly fieldChangeLogService: FieldchangeLogService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    id: Buffer,
    adminName: string,
  ): Promise<UserEntity[] | null> {
    const users = this.userRepository.find({
      select: [
        'name',
        'email',
        'role',
        'isActive',
        'emailVerified',
        'createdAt',
        'updatedAt',
      ],
    });

    this.loggingService.info(
      `${limit} usuários listados pelo usuário ${adminName} (id ${this.utilityService.bufferToUuid(id)}) em ${new Date().toISOString()}`,
    );

    return users;
  }
  async create(user: CreateUserDTO): Promise<UserEntity | null> {
    const { name, email, password } = user;
    const hasEmail = await this.userRepository.findOne({ where: { email } });

    if (hasEmail) {
      return null;
    }

    const encryptedPassword = encrypt(password, 15);

    const binaryUUID = this.utilityService.generateUuidAndTransformInBuffer();

    const userData = this.userRepository.create({
      id: binaryUUID,
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const savedUser = await this.userRepository.save(userData);

    return savedUser;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }
    this.loggingService.info(
      `Usuário ${user.name} de id ${this.utilityService.bufferToUuid(user.id)} listado em ${new Date().toISOString()}`,
    );
    return user;
  }
  async findOneById(id: Buffer): Promise<UserInterface | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['provider'],
    });
    if (!user) {
      this.loggingService.warning(
        `Falha ao listar usuário com o ID ${this.utilityService.bufferToUuid(id)}: Usuário não encontrado.`,
      );
      return null;
    }

    const data = {
      name: user.name,
      email: user.email,
      role: user.role,
      birthDate: user.birthDate,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      business: user.provider
        ? {
            name: user.provider?.businessName,
            about: user.provider?.about,
            category: user.provider?.category,
            url: user.provider?.url,
            rating: user.provider?.rating,
            logo: user.provider?.logo,
            cover: user.provider?.cover,
            hasAutomaticUpdate: user.provider?.hasAutomaticUpdate,
          }
        : null,
    };
    this.loggingService.info(
      `Usuário ${user.name} de id ${this.utilityService.bufferToUuid(user.id)} listado` +
        (user.provider
          ? `, com o negócio ${user.provider.businessName} de id ${this.utilityService.bufferToUuid(user.provider.id)}`
          : ', ainda não possui uma empresa cadastrada'),
    );
    if (!user.provider) {
      this.loggingService.info(
        `Usuário ${user.name} de id ${this.utilityService.bufferToUuid(user.id)} ainda não criou uma empresa.`,
      );
    }
    return data;
  }
  async verifyEmailUser(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (user) {
      user.emailVerified = true;

      const savedUser = await this.userRepository.save(user);
      this.loggingService.info(
        `O email do Usuário ${user.name} de id ${this.utilityService.bufferToUuid(user.id)} foi verificado em ${new Date().toISOString()}`,
      );
      return savedUser;
    }
    return null;
  }
  async updatePassword(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      return null;
    }
    const encryptedPassword = encrypt(password, 15);
    user.password = encryptedPassword;
    await this.emailService.deleteCodeEmail(email);
    return await this.userRepository.save(user);
  }
  async updateImageUser(
    id: Buffer,
    logoPath: string | null,
    coverPath: string | null,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (logoPath) {
      // user.logo = logoPath;
    }
    if (coverPath) {
      // user.cover = coverPath;
    }
    return await this.userRepository.save(user);
  }
  async updateDataUser(
    id: Buffer,
    data: UpdateDataUserDTO,
  ): Promise<UserEntity | null> {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!foundUser) {
      this.loggingService.warning(
        `Falha ao listar usuário com o ID ${this.utilityService.bufferToUuid(id)}: Usuário não encontrado.`,
      );
      return null;
    }

    foundUser.name = data.name;
    foundUser.birthDate = data.birthDate;
    const updatedUser = await this.userRepository.save(foundUser);
    this.loggingService.info(
      `Usuário com ID ${id} (${foundUser.name}) alterou o nome de ${foundUser.name} para ${data.name} e a data de nascimento de ${foundUser.birthDate} para ${data.birthDate}.`,
    );

    return updatedUser;
  }

  async updateEmailUser(
    id: Buffer,
    data: UpdateEmailUserDTO,
  ): Promise<
    | BooleanObject<'userNotFound'>
    | BooleanObject<'outTime'>
    | BooleanObject<'credentialsIsInvalid'>
    | NumberObject<'remainingTime'>
  > {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!foundUser) {
      this.loggingService.warning(
        `Falha ao listar usuário com o ID ${this.utilityService.bufferToUuid(id)}: Usuário não encontrado.`,
      );
      return {
        userNotFound: true,
        outTime: false,
        credentialsIsInvalid: false,
      };
    }
    const passwordValidate = await this.authService.validateUser(
      foundUser.email,
      data.password,
    );
    if (!passwordValidate) {
      return {
        userNotFound: false,
        outTime: false,
        credentialsIsInvalid: true,
      };
    }

    const logEmail = await this.fieldChangeLogService.showLog(id, 'email');
    if (logEmail) {
      const hasExpired = this.utilityService.hasExpired(
        logEmail.createdAt,
        timeToWaitInHours,
      );

      if (!hasExpired) {
        const remainingTime = this.utilityService.reimaningTime(
          logEmail.createdAt,
          timeToWaitInHours,
        );
        return {
          userNotFound: false,
          outTime: true,
          credentialsIsInvalid: false,
          remainingTime: remainingTime,
        };
      }
    }
    const oldEmail = foundUser.email;
    foundUser.email = data.email;

    await this.userRepository.save(foundUser);
    this.loggingService.info(
      `Usuário com ID ${id} (${foundUser.name}) alterou o email de ${foundUser.email} para ${data.email}.`,
    );
    await this.fieldChangeLogService.createLog(
      id,
      'email',
      foundUser.email,
      data.email,
      false,
    );

    const HTMLContent = `
      <p>Olá, <strong>${foundUser.name}</strong></p>
      <p style="text-align: justify;">Gostaríamos de informar que o email associado à sua conta foi alterado com sucesso. A partir de agora, todas as comunicações serão enviadas para o novo endereço de email: ${data.email}.</p>
      <p style="text-align: justify;">Se você não solicitou essa alteração ou acredita que houve algum erro, por favor, entre em contato com nosso suporte imediatamente para que possamos garantir a segurança da sua conta.</p>
    `;
    const textContent = `
      Olá, ${foundUser.name} \n
      Gostaríamos de informar que o email associado à sua conta foi alterado com sucesso. A partir de agora, todas as comunicações serão enviadas para o novo endereço de email: ${data.email}.\n
      Se você não solicitou essa alteração ou acredita que houve algum erro, por favor, entre em contato com nosso suporte imediatamente para que possamos garantir a segurança da sua conta.
    `;
    const formatedHTML = await this.utilityService.formatHTML(
      'Atualização de Email Realizada com Sucesso',
      HTMLContent,
    );

    await this.emailService.sendEmail(
      oldEmail,
      'Atualização de Email Realizada com Sucesso',
      textContent,
      formatedHTML,
    );
    return {
      userNotFound: false,
      outTime: false,
      credentialsIsInvalid: false,
    };
  }
}
