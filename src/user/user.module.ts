import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggingModule } from 'src/logging/logging.module';
import { UtilityModule } from 'src/utility/Utility.module';
import { FieldChangeModule } from 'src/field_change_log/field_change_log.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [
    DatabaseModule,
    EmailModule,
    JwtModule,
    LoggingModule,
    UtilityModule,
    FieldChangeModule,
    forwardRef(() => AuthModule),
  ],
  providers: [...userProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
