import { forwardRef, Module } from '@nestjs/common';
import { FieldchangeLogService } from './field_change_log.service';
import { fieldChangeLogProviders } from './field_change_log.providers';
import { DatabaseModule } from 'src/database/database.module';
import { LoggingModule } from 'src/logging/logging.module';
import { UtilityModule } from 'src/utility/Utility.module';

@Module({
  imports: [DatabaseModule, LoggingModule, forwardRef(() => UtilityModule)],
  controllers: [],
  providers: [...fieldChangeLogProviders, FieldchangeLogService],
  exports: [FieldchangeLogService],
})
export class FieldChangeModule {}
