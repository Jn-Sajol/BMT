import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { RecommendationEngineService } from './recommendation-engine.service';
import { RecommendationScoreService } from './recommendation-score.service';

@Injectable()
export class RecommendationObserver implements OnModuleInit {
  constructor(
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    private readonly engine: RecommendationEngineService,
    private readonly scoreService: RecommendationScoreService,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe('*', this.handleEvent.bind(this));
  }

  async handleEvent(event: DomainEvent): Promise<void> {
    const targetNames = [
      'Insights Synced',
      'Workflow Executed',
      'Rule Evaluated',
      'Execution Completed',
      'Analytics Updated',
      'Action Completed',
    ];

    if (!targetNames.includes(event.name)) {
      return;
    }

    try {
      await this.engine.evaluateAndGenerate(event.workspaceId);
      await this.scoreService.calculateAndSaveScore(event.workspaceId);
    } catch (err) {
      console.error('Recommendation passive observer hook failed:', err);
    }
  }
}
