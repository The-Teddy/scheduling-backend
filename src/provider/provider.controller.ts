import {
  Controller,
  Post,
  Put,
  Body,
  Res,
  Req,
  HttpStatus,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { Response, Request } from 'express';
import { CreateProviderDTO } from './create.provider.dto';
import { LoggingService } from 'src/logging/logging.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { UtilityService } from 'src/utility/Utility.service';

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService,
    private readonly loggingService: LoggingService,
    private readonly utilityService: UtilityService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProviderDTO: CreateProviderDTO,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const user = request.user;
    const { id, name }: any = user;

    if (!user || !id || !id.data) {
      this.loggingService.warning('Usuário não autenticado ou ID inválido');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Usuário não autenticado.' });
    }
    const uuidBuffer = this.utilityService.uuidBuffer(id);

    try {
      const createdProvider = await this.providerService.create(
        uuidBuffer,
        name,
        createProviderDTO,
      );

      if (!createdProvider) {
        return response
          .status(HttpStatus.CONFLICT)
          .json({ message: 'Usuário já possui uma empresa cadastrada.' });
      }
      return response.sendStatus(200);
    } catch (error) {
      this.loggingService.error(
        `Falha ao cadastrar a empresa '${createProviderDTO.businessName}' para o usuário '${name}' (ID: ${this.utilityService.bufferToUuid(uuidBuffer)}) em ${new Date().toISOString()}: ${error.message}`,
      );

      throw new HttpException(
        `Falha ao cadastrar empresa. Por favor, tente novamente mais tarde.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
