import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateCategoryDTO, UpdateCategoryDTO } from './category.dto';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateCategoryDTO,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const { id, role, name }: any = request.user;
      const uuidBuffer = Buffer.from(id.data);

      const createCategory = await this.categoryService.createCategory(
        body,
        uuidBuffer,
        role,
        name,
      );
      if (!createCategory) {
        return response.status(HttpStatus.OK).json({
          message: 'Essa categoria ja existe',
        });
      }

      return response
        .status(HttpStatus.CREATED)
        .json({ message: 'Categoria criada com sucesso' });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro interno do servidor. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(
    @Req() request: Request,
    @Res() response: Response,
    @Query('page') page: number = 1, // Página padrão: 1
    @Query('limit') limit: number = 10, //
  ): Promise<any> {
    try {
      const categories = await this.categoryService.getAllCategories(
        page,
        limit,
      );

      return response.status(200).json({ data: categories });
    } catch (error) {
      throw new HttpException(
        'Um erro ocorreu durante a listagem das categorias',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('details')
  @UseGuards(JwtAuthGuard)
  async show(@Res() response: Response, @Query('id') id: number): Promise<any> {
    const category = await this.categoryService.getCategoryById(Number(id));

    return response.status(HttpStatus.OK).json({ category });
  }
  @Put('update')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const { id, role, name }: any = request.user;
      const uuidBuffer = Buffer.from(id.data);

      const result = await this.categoryService.updateCategory(
        updateCategoryDTO,
        uuidBuffer,
        name,
        role,
      );
      if (result.notFound) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Categoria não encontrada',
        });
      }
      if (result.notAuthorized) {
        return response.status(HttpStatus.FORBIDDEN).json({
          message: 'Você não tem permissão para alterar essa categoria',
        });
      }
      if (result.isUnchanged) {
        return response
          .status(HttpStatus.OK)
          .json({ message: 'Nenhuma alteração foi feita' });
      }

      return response
        .status(HttpStatus.OK)
        .json({ message: 'Categoria atualizada com sucesso' });
    } catch (error) {
      throw new HttpException(
        'Erro interno do servidor. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
