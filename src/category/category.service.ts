import { Injectable, Inject } from '@nestjs/common';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO, UpdateCategoryDTO } from './category.dto';
import { UtilityService } from 'src/utility/Utility.service';
import { CategoryInterface } from './category.interface';
import { updateCategoryResponseInterface } from 'src/interfaces/interfaces';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly utilityService: UtilityService,
    private readonly loggingService: LoggingService,
  ) {}

  async getAllCategories(
    page: number,
    limit: number,
    id: Buffer,
  ): Promise<any> {
    const [result, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }, // Ordenar pelos campos de sua escolha
    });

    this.loggingService.info(
      `${limit} categorias listadas pelo usuário de id ${this.utilityService.bufferToUuid(id)} em ${new Date().toISOString()}`,
    );
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
    role: string,
    name: string,
  ): Promise<CategoryInterface | null> {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: category.name,
      },
    });
    if (existingCategory) {
      this.loggingService.warning(
        `Tentativa de criar a categoria ${category.name} falhou: categoria já existe na base de dados. Ação realizada pelo usuário de id ${this.utilityService.bufferToUuid(id)} em ${new Date().toISOString()}.`,
      );

      return null;
    }
    const isSuggested = role === 'admin' || role === 'super-admin';

    const categoryData = this.categoryRepository.create({
      name: category.name,
      description: category.description,
      createdBy: id,
      isSuggested: !isSuggested,
      createdByName: name,
    });

    const savedCategory = await this.categoryRepository.save(categoryData);
    this.loggingService.info(
      `Categoria ${categoryData.name} criada pelo usuário de id ${this.utilityService.bufferToUuid(id)} em ${new Date().toISOString()}`,
    );
    return savedCategory;
  }
  async getCategoryById(
    id: number,
    idUser: Buffer,
  ): Promise<CategoryInterface | null> {
    if (this.utilityService.isPositiveInteger(id)) {
      const category = await this.categoryRepository.findOne({
        where: {
          id,
        },
      });

      if (category) {
        this.loggingService.info(
          `Categoria ${category.name} listada pelo usuário de id ${this.utilityService.bufferToUuid(idUser)} em ${new Date().toISOString()}`,
        );
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          observation: category.observation,
          approvalStatus: category.approvalStatus,
          analizedByName: category.analizedByName,
          createdByName: category.createdByName,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          isActive: category.isActive,
          isSuggested: category.isSuggested,
        };
      }
    }
    this.loggingService.warning(
      `Categoria de ${id} não encontrada em ${new Date().toISOString()}`,
    );
    return null;
  }
  async updateCategory(
    category: UpdateCategoryDTO,
    id: Buffer,
    name: string,
    role: string,
  ): Promise<null | updateCategoryResponseInterface> {
    const categoryDatabase = await this.categoryRepository.findOne({
      where: {
        id: category.id,
      },
    });
    if (!categoryDatabase) {
      this.loggingService.warning(
        `Categoria de ${category.id} não encontrada em ${new Date().toISOString()}`,
      );
      return {
        notFound: true,
        isUnchanged: false,
        category: null,
        notAuthorized: false,
      };
    }
    if (categoryDatabase.approvalStatus !== 'pendente') {
      if (role !== 'super-admin') {
        this.loggingService.warning(
          `Categoria de ${category.id} não atualizada em ${new Date().toISOString()}: Usuário de id ${this.utilityService.bufferToUuid(id)} não autorizado`,
        );
        return {
          notFound: false,
          isUnchanged: false,
          category: null,
          notAuthorized: true,
        };
      }
    }
    const isNameUnchanged = category.name === categoryDatabase?.name;
    const isDescriptionUnchanged =
      category.description === categoryDatabase.description;
    const isObservationUnchanged =
      category.observation === categoryDatabase.observation;

    const isActiveUnchanged = category.isActive === categoryDatabase.isActive;
    const isApprovalStatusUnchanged =
      category.approvalStatus === categoryDatabase.approvalStatus;

    const isInitialCategory =
      isNameUnchanged &&
      isDescriptionUnchanged &&
      isObservationUnchanged &&
      isActiveUnchanged &&
      isApprovalStatusUnchanged;

    if (isInitialCategory) {
      this.loggingService.warning(
        `Categoria de ${category.id} não atualizada em ${new Date().toISOString()}: Não houve alteração`,
      );
      return {
        notFound: false,
        isUnchanged: true,
        category: null,
        notAuthorized: false,
      };
    }
    categoryDatabase.name = category.name;
    categoryDatabase.description = category.description;
    categoryDatabase.observation = category.observation;
    categoryDatabase.isActive = category.isActive;

    if (!categoryDatabase.analizedBy) {
      categoryDatabase.analizedBy = id;
    }
    if (!categoryDatabase.analizedByName) {
      categoryDatabase.analizedByName = name;
    }

    categoryDatabase.approvalStatus = category.approvalStatus;
    if (category.approvalStatus === 'rejeitado') {
      categoryDatabase.isActive = false;
    }

    const savedCategory = await this.categoryRepository.save(categoryDatabase);

    this.loggingService.info(
      `Categoria ${category.name} alterada pelo usuário de id ${this.utilityService.bufferToUuid(id)} em ${new Date().toISOString()}`,
    );
    return {
      notFound: false,
      isUnchanged: false,
      category: savedCategory,
      notAuthorized: false,
    };
  }
}
