import { Module } from '@nestjs/common';
import { RecommendationProviderRegistry } from './infrastructure/registries/recommendation-provider.registry';
import { RecommendationExplainabilityService } from './application/services/recommendation-explainability.service';
import { PriorityEngineService } from './application/services/priority-engine.service';
import { RecommendationExpirationService } from './application/services/recommendation-expiration.service';
import { RecommendationScoreService } from './application/services/recommendation-score.service';
import { RecommendationEngineService } from './application/services/recommendation-engine.service';
import { RecommendationHistoryService } from './application/services/recommendation-history.service';
import { RecommendationObserver } from './application/services/recommendation-observer.service';
import { RecommendationController } from './presentation/recommendation.controller';
import { ActionModule } from '../action/action.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, ActionModule],
  controllers: [RecommendationController],
  providers: [
    RecommendationProviderRegistry,
    RecommendationExplainabilityService,
    PriorityEngineService,
    RecommendationExpirationService,
    RecommendationScoreService,
    RecommendationEngineService,
    RecommendationHistoryService,
    RecommendationObserver,
  ],
  exports: [
    RecommendationProviderRegistry,
    RecommendationExplainabilityService,
    PriorityEngineService,
    RecommendationExpirationService,
    RecommendationScoreService,
    RecommendationEngineService,
    RecommendationHistoryService,
    RecommendationObserver,
  ],
})
export class RecommendationModule {}
