import { Injectable } from '@nestjs/common';
import { IRecommendationProvider } from '../../domain/ports/recommendation-provider.interface';

export class RuleBasedRecommendationProvider implements IRecommendationProvider {
  providerName() { return 'RULE_BASED'; }
  providerVersion() { return '1.0'; }
  supports(entityType: string) { return true; }
  async validate(payload: any) { return true; }

  async generate(workspaceId: string): Promise<any[]> {
    return [
      {
        recommendationType: 'BUDGET',
        entityType: 'CAMPAIGN',
        entityId: 'campaign-101',
        title: 'High CPA Budget Optimization Alert',
        description: 'CPA has exceeded standard threshold of $20. Recommend reducing budget by 20%.',
        reason: 'Campaign campaign-101 CPA is currently $24.50.',
        confidenceScore: 0.85,
        expectedImpact: 'Potential savings: $250.00 / week',
        priority: 'HIGH',
        metadata: { budgetChange: -0.2, currentCPA: 24.5 },
      },
    ];
  }
}

export class GptRecommendationProvider implements IRecommendationProvider {
  providerName() { return 'GPT'; }
  providerVersion() { return '4.0'; }
  supports(entityType: string) { return entityType === 'CAMPAIGN' || entityType === 'CREATIVE'; }
  async validate(payload: any) { return true; }
  async generate(workspaceId: string) { return []; }
}

export class ClaudeRecommendationProvider implements IRecommendationProvider {
  providerName() { return 'CLAUDE'; }
  providerVersion() { return '3.5'; }
  supports(entityType: string) { return true; }
  async validate(payload: any) { return true; }
  async generate(workspaceId: string) { return []; }
}

export class GeminiRecommendationProvider implements IRecommendationProvider {
  providerName() { return 'GEMINI'; }
  providerVersion() { return '1.5'; }
  supports(entityType: string) { return true; }
  async validate(payload: any) { return true; }
  async generate(workspaceId: string) { return []; }
}

export class InternalMlRecommendationProvider implements IRecommendationProvider {
  providerName() { return 'INTERNAL_ML'; }
  providerVersion() { return '2.0'; }
  supports(entityType: string) { return true; }
  async validate(payload: any) { return true; }
  async generate(workspaceId: string) { return []; }
}

@Injectable()
export class RecommendationProviderRegistry {
  private providers = new Map<string, IRecommendationProvider>();

  constructor() {
    this.register(new RuleBasedRecommendationProvider());
    this.register(new GptRecommendationProvider());
    this.register(new ClaudeRecommendationProvider());
    this.register(new GeminiRecommendationProvider());
    this.register(new InternalMlRecommendationProvider());
  }

  register(provider: IRecommendationProvider): void {
    this.providers.set(provider.providerName().toUpperCase(), provider);
  }

  resolve(name: string): IRecommendationProvider | undefined {
    return this.providers.get(name.toUpperCase());
  }

  getAll(): IRecommendationProvider[] {
    return Array.from(this.providers.values());
  }
}
