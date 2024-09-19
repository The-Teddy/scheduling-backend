import { forwardRef, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { emailProviders } from './email.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { UtilityModule } from 'src/utility/Utility.module';
import { EmailController } from './email.controller';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    UtilityModule,
    LoggingModule,
  ],
  providers: [...emailProviders, EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
