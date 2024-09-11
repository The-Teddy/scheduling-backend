import { Inject, Injectable } from '@nestjs/common';
import { ProviderEntity } from 'src/database/entities/providers.entity';
import { Repository } from 'typeorm';
import { CreateProviderDTO } from './create.provider.dto';

@Injectable()
export class ProviderService {
  constructor(
    @Inject('PROVIDER_REPOSITORY')
    private providerRepository: Repository<ProviderEntity>,
  ) {}
  async create(provider: CreateProviderDTO): Promise<ProviderEntity | null> {
    const { userId, businessName, category } = provider;

    const hasProvider = await this.providerRepository.findOne({
      where: {
        userId,
      },
    });

    if (hasProvider) {
      return null;
    }

    const providerData = this.providerRepository.create({
      userId,
      businessName,
      category,
    });

    return this.providerRepository.save(providerData);
  }
}
