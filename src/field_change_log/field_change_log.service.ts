import { FieldChangeLogEntity } from './../database/entities/field_change_log.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LoggingService } from 'src/logging/logging.service';
import { UtilityService } from 'src/utility/Utility.service';
import { Repository } from 'typeorm';

@Injectable()
export class FieldchangeLogService {
  constructor(
    @Inject('FIELD_CHANGE_LOG_REPOSITORY')
    private fieldChangeLogRepository: Repository<FieldChangeLogEntity>,
    private readonly logginService: LoggingService,
    @Inject(forwardRef(() => UtilityService))
    private readonly utilityService: UtilityService,
  ) {}

  async createLog(
    providerId: Buffer,
    fieldName: string,
    previousValue: any,
    newValue: any,
    isProviderId: boolean,
    userJustification: string = null,
  ): Promise<FieldChangeLogEntity | null> {
    const createLog = this.fieldChangeLogRepository.create({
      providerOrUserId: providerId,
      fieldName: fieldName,
      previousValue: previousValue,
      newValue: newValue,
      automaticUpdate: true,
      userJustification: userJustification,
      isProviderId: isProviderId,
    });
    const createdLog = await this.fieldChangeLogRepository.save(createLog);
    this.logginService.info(`
      Log do campo ${fieldName} criado com sucesso para o usuário de id ${this.utilityService.bufferToUuid(providerId)}
      `);
    return createdLog;
  }
  async showLog(
    providerId: Buffer,
    fieldName: string,
  ): Promise<FieldChangeLogEntity | null> {
    const foundLog = await this.fieldChangeLogRepository.findOne({
      where: {
        providerOrUserId: providerId,
        fieldName: fieldName,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!foundLog) {
      if (!foundLog) {
        this.logginService.warning(`
          Falha ao consultar o log do campo ${fieldName} para o usuário de id ${this.utilityService.bufferToUuid(providerId)}: Provedor não tem nenhum log cadastrado para o campo ${fieldName}
          `);
        return null;
      }

      return null;
    }

    this.logginService.info(`
      Sucesso ao consultar o log do campo ${fieldName} para o usuário de id ${this.utilityService.bufferToUuid(providerId)}
      `);
    return foundLog;
  }
}
