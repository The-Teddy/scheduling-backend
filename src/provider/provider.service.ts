import { Inject, Injectable } from '@nestjs/common';
import { ProviderEntity } from 'src/database/entities/providers.entity';
import { Repository } from 'typeorm';
import { CreateUpdateProviderDTO } from './create.provider.dto';
import { UtilityService } from 'src/utility/Utility.service';
import { LoggingService } from 'src/logging/logging.service';
import { BooleanObject } from 'src/interfaces/interfaces';
import { timeToWaitInHours } from 'src/global/globalVariablesAndConstants';
import { FieldchangeLogService } from 'src/field_change_log/field_change_log.service';
import { UpdateCriticalResult } from 'src/global/types';
import { ProviderResponses } from 'src/global/responses';

@Injectable()
export class ProviderService {
  constructor(
    @Inject('PROVIDER_REPOSITORY')
    private providerRepository: Repository<ProviderEntity>,
    private readonly utilityService: UtilityService,
    private readonly loggingService: LoggingService,
    private readonly fieldChangeLogService: FieldchangeLogService,
  ) {}
  async create(
    id: Buffer,
    name: string,
    provider: CreateUpdateProviderDTO,
  ): Promise<ProviderEntity | null> {
    const { url, businessName, category, document } = provider;

    const foundProvider = await this.providerRepository.findOne({
      where: {
        userId: id,
      },
    });

    if (foundProvider) {
      this.loggingService.warning(
        `Falha ao atualizar empresa com ID ${this.utilityService.bufferToUuid(id)} para o usuário ${name}: Empresa não encontrada`,
      );

      return null;
    }
    const binaryUUID = this.utilityService.generateUuidAndTransformInBuffer();

    const providerData = this.providerRepository.create({
      id: binaryUUID,
      userId: id,
      businessName,
      document,
      category,
      url,
    });
    const savedProvider = await this.providerRepository.save(providerData);
    this.loggingService.info(
      `Empresa ${provider.businessName} criada com sucesso para o usuário ${name} de id ${this.utilityService.bufferToUuid(id)}`,
    );
    return savedProvider;
  }
  async updateCritical(
    id: Buffer,
    name: string,
    provider: CreateUpdateProviderDTO,
  ): Promise<UpdateCriticalResult> {
    const { url, businessName, category, document } = provider;

    const foundProvider = await this.providerRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!foundProvider) {
      this.loggingService.warning(
        `Falha ao atualizar empresa ${foundProvider.businessName} para o usuário ${name} de id ${this.utilityService.bufferToUuid(id)}: Empresa não encontrada`,
      );
      return ProviderResponses.providerNotFound;
    }
    if (foundProvider.hasAutomaticUpdate) {
      this.loggingService.warning(
        `Falha ao atualizar empresa ${foundProvider.businessName} para o usuário ${name} de id ${this.utilityService.bufferToUuid(id)}: Empresa já atualizou os dados de forma automática`,
      );
      return ProviderResponses.automaticUpdateLimitReached;
    }
    const hasExpired = this.utilityService.hasExpired(
      foundProvider.createdAt,
      timeToWaitInHours,
    );

    if (hasExpired) {
      this.loggingService.warning(
        `Falha ao atualizar empresa ${foundProvider.businessName} para o usuário ${name} de id ${this.utilityService.bufferToUuid(id)}: Prazo para a atualização automática expirou`,
      );
      return ProviderResponses.updateTimeExpired;
    }

    if (foundProvider.businessName !== businessName) {
      await this.fieldChangeLogService.createLog(
        id,
        'businessName',
        foundProvider.businessName,
        businessName,
        true,
        'aprovado',
        true,
      );
      foundProvider.businessName = businessName;
    }
    if (foundProvider.url !== url) {
      await this.fieldChangeLogService.createLog(
        id,
        'url',
        foundProvider.url,
        url,
        true,
        'aprovado',
        true,
      );
      foundProvider.url = url;
    }
    if (foundProvider.category !== category) {
      await this.fieldChangeLogService.createLog(
        id,
        'category',
        foundProvider.category,
        category,
        true,
        'aprovado',
        true,
      );
      foundProvider.category = category;
    }
    if (foundProvider.document !== document) {
      await this.fieldChangeLogService.createLog(
        id,
        'document',
        foundProvider.document,
        document,
        true,
        'aprovado',
        true,
      );
      foundProvider.document = document;
    }

    foundProvider.hasAutomaticUpdate = true;
    const savedProvider = await this.providerRepository.save(foundProvider);

    this.loggingService.info(
      `Empresa ${foundProvider.businessName} de id ${this.utilityService.bufferToUuid(id)} atualizou os dados criticos de maneira automatíca`,
    );
    return ProviderResponses.updateSuccessful;
  }
}
