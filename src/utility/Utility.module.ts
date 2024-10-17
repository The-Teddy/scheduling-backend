import { forwardRef, Module } from '@nestjs/common';
import { UtilityService } from './Utility.service';
import { FieldChangeModule } from 'src/field_change_log/field_change_log.module';

@Module({
  imports: [FieldChangeModule],
  providers: [UtilityService],
  exports: [UtilityService],
})
export class UtilityModule {}
