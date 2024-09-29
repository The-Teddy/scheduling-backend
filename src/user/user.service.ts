import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { CreateUserDto } from './create.user.dto';
import { hashSync as encrypt } from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { LoggingService } from 'src/logging/logging.service';
import { UtilityService } from 'src/utility/Utility.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
    private readonly loggingService: LoggingService,
    private readonly utilityService: UtilityService,
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
  async create(user: CreateUserDto): Promise<UserEntity | null> {
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
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }
    this.loggingService.info(
      `Usuário ${user.name} de id ${this.utilityService.bufferToUuid(user.id)} listado em ${new Date().toISOString()}`,
    );
    return user;
  }
  async findOneById(id: Buffer): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    this.loggingService.info(
      `Usuário ${user.name} de id ${this.utilityService.bufferToUuid(user.id)} listado em ${new Date().toISOString()}`,
    );
    return user;
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
}
