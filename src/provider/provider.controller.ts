import { Controller, Post, Body, Res } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { Response } from 'express';
import { CreateProviderDTO } from './create.provider.dto';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('create')
  async create(
    @Body() createProviderDTO: CreateProviderDTO,
    @Res() response: Response,
  ): Promise<any> {}
}
