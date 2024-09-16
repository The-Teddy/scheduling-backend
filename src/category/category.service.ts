import { Injectable, Inject } from '@nestjs/common';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './category.dto';
import { UtilityService } from 'src/utility/Utility.service';
import { CategoryInterface } from './category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly utilityService: UtilityService,
  ) {}

  async getAllCategories(page: number, limit: number): Promise<any> {
    const [result, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }, // Ordenar pelos campos de sua escolha
    });

    return {
      data: result,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
  async createCategory(
    category: CreateCategoryDTO,
    id: Buffer,
  ): Promise<CategoryInterface | null> {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: category.name,
      },
    });
    if (existingCategory) {
      return null;
    }

    const categoryData = this.categoryRepository.create({
      name: category.name,
      description: category.description,
      createdBy: id,
    });

    return this.categoryRepository.save(categoryData);
  }
  async getCategoryById(id: number): Promise<CategoryInterface | null> {
    if (this.utilityService.isPositiveInteger(id)) {
      const category = await this.categoryRepository.findOne({
        where: {
          id,
        },
      });
      if (category) {
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          observation: category.observation,
          approvalStatus: category.approvalStatus,
          approvedByName: category.approvedByName,
          createdByName: category.createdByName,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          isActive: category.isActive,
          isSuggested: category.isSuggested,
        };
      }
    }

    return null;
  }
}
