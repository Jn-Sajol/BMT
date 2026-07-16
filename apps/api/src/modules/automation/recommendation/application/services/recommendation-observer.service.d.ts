import { OnModuleInit } from '@nestjs/common';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { RecommendationEngineService } from './recommendation-engine.service';
import { RecommendationScoreService } from './recommendation-score.service';
export declare class RecommendationObserver implements OnModuleInit {
    private readonly eventBus;
    private readonly engine;
    private readonly scoreService;
    constructor(eventBus: IEventBus, engine: RecommendationEngineService, scoreService: RecommendationScoreService);
    onModuleInit(): void;
    handleEvent(event: DomainEvent): Promise<void>;
}
