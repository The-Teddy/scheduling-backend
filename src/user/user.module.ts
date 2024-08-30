import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  imports: [DatabaseModule, EmailModule, JwtModule],
  providers: [...userProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
