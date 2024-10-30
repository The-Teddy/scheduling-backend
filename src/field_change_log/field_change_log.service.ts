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
    providerOrUserId: Buffer,
    fieldName: string,
    previousValue: any,
    newValue: any,
    isProviderId: boolean,
    status: 'pendente' | 'aprovado' | 'rejeitado',
    automaticUpdate: boolean,
    userJustification: string = null,
  ): Promise<FieldChangeLogEntity | null> {
    const createLog = this.fieldChangeLogRepository.create({
      providerOrUserId: providerOrUserId,
      fieldName: fieldName,
      previousValue: previousValue,
      newValue: newValue,
      automaticUpdate: automaticUpdate,
      userJustification: userJustification,
      status: status,
      isProviderId: isProviderId,
    });
    const createdLog = await this.fieldChangeLogRepository.save(createLog);
    this.logginService.info(`
      Log do campo ${fieldName} criado com sucesso para o usuário de id ${this.utilityService.bufferToUuid(providerOrUserId)}
      `);
    return createdLog;
  }
  async showLog(
    providerOrUserId: Buffer,
    fieldName: string,
  ): Promise<FieldChangeLogEntity | null> {
    const foundLog = await this.fieldChangeLogRepository.findOne({
      where: {
        providerOrUserId: providerOrUserId,
        fieldName: fieldName,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!foundLog) {
      if (!foundLog) {
        this.logginService.warning(`
          Falha ao consultar o log do campo ${fieldName} para o usuário de id ${this.utilityService.bufferToUuid(providerOrUserId)}: Provedor não tem nenhum log cadastrado para o campo ${fieldName}
          `);
        return null;
      }

      return null;
    }

    this.logginService.info(`
      Sucesso ao consultar o log do campo ${fieldName} para o usuário de id ${this.utilityService.bufferToUuid(providerOrUserId)}
      `);
    return foundLog;
  }
}
