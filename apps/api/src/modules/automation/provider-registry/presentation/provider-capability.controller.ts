import { Controller, Get, Query, UseGuards, Inject, NotFoundException } from '@nestjs/common';
import { IProviderCapabilityRegistry } from '../domain/ports/provider-capability-registry.interface';
import { AuthGuard } from '../../../../common/guards/auth.guard';

@Controller('api/automation/providers')
@UseGuards(AuthGuard)
export class ProviderCapabilityController {
  constructor(
    @Inject('IProviderCapabilityRegistry')
    private readonly registry: IProviderCapabilityRegistry,
  ) {}

  @Get('capabilities')
  async getCapabilities(@Query('provider') provider: string) {
    if (!provider) {
      throw new NotFoundException('provider parameter is required.');
    }
    const caps = this.registry.getCapabilities(provider);
    if (!caps) {
      throw new NotFoundException(`No capabilities found for provider: ${provider}`);
    }
    return caps;
  }

  @Get('list')
  async listProviders() {
    return this.registry.getProviders();
  }
}
