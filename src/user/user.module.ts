import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggingModule } from 'src/logging/logging.module';
import { UtilityModule } from 'src/utility/Utility.module';

@Module({
  controllers: [UserController],
  imports: [
    DatabaseModule,
    EmailModule,
    JwtModule,
    LoggingModule,
    UtilityModule,
  ],
  providers: [...userProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
