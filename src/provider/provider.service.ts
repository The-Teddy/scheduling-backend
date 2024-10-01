import { Inject, Injectable } from '@nestjs/common';
import { ProviderEntity } from 'src/database/entities/providers.entity';
import { Repository } from 'typeorm';
import { CreateProviderDTO } from './create.provider.dto';
import { UtilityService } from 'src/utility/Utility.service';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class ProviderService {
  constructor(
    @Inject('PROVIDER_REPOSITORY')
    private providerRepository: Repository<ProviderEntity>,
    private readonly utilityService: UtilityService,
    private readonly loggingService: LoggingService,
  ) {}
  async create(
    userId: Buffer,
    name: string,
    provider: CreateProviderDTO,
  ): Promise<ProviderEntity | null> {
    const { url, businessName, category, document } = provider;

    const hasProvider = await this.providerRepository.findOne({
      where: {
        userId,
      },
    });

    if (hasProvider) {
      this.loggingService.warning(
        `Falha ao cadastrar empresa ${provider.businessName} para o usuário ${name} de id ${this.utilityService.bufferToUuid(userId)}: Usuário já possui uma empresa cadastrada`,
      );
      return null;
    }
    const binaryUUID = this.utilityService.generateUuidAndTransformInBuffer();

    const providerData = this.providerRepository.create({
      id: binaryUUID,
      userId,
      businessName,
      document,
      category,
      url,
    });
    const savedProvider = await this.providerRepository.save(providerData);
    this.loggingService.info(
      `Empresa ${provider.businessName} criada com sucesso para o usuário ${name} de id ${this.utilityService.bufferToUuid(userId)}`,
    );
    return savedProvider;
  }
}
