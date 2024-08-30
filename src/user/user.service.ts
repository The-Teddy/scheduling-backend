import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './create.user.dto';
import { hashSync as encrypt } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<UserEntity[] | null> {
    return this.userRepository.find();
  }
  async create(user: CreateUserDto): Promise<UserEntity | null> {
    const { name, email, password } = user;
    const hasEmail = await this.userRepository.findOne({ where: { email } });

    if (hasEmail) {
      return null;
    }
    let id = uuidv4();

    const encryptedPassword = encrypt(password, 15);

    const binaryUUID = Buffer.from(id.replace(/-/g, ''), 'hex');

    const userData = this.userRepository.create({
      id: binaryUUID,
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    return this.userRepository.save(userData);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
  async findOneById(id: Buffer): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { id } });
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

      return await this.userRepository.save(user);
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
  async updateLogoUser(
    id: Buffer,
    logoPath: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    user.logo = logoPath;
    return await this.userRepository.save(user);
  }
}
