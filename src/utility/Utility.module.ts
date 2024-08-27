import { Module } from '@nestjs/common';
import { UtilityService } from './Utility.service';

@Module({
  providers: [UtilityService],
  exports: [UtilityService],
})
export class UtilityModule {}
