import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UtilityModule } from 'src/utility/Utility.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [UserController],
  imports: [DatabaseModule, UtilityModule, EmailModule],
  providers: [...userProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
