import { forwardRef, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { emailProviders } from './email.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { UtilityModule } from 'src/utility/Utility.module';
import { EmailController } from './email.controller';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule), UtilityModule],
  providers: [...emailProviders, EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
