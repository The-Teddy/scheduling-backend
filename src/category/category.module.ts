import { Module } from '@nestjs/common';
import { categoryProviders } from './category.providers';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { UtilityModule } from 'src/utility/Utility.module';

@Module({
  imports: [DatabaseModule, JwtModule, UtilityModule],
  providers: [...categoryProviders, CategoryService],
  exports: [],
  controllers: [CategoryController],
})
export class CategoryModule {}
