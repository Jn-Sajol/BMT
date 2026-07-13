import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { PropertyResolver } from './application/services/property-resolver.service';
import { ConditionResolver } from './application/services/condition-resolver.service';
import { ConditionRegistry } from './infrastructure/registry/condition-registry';
import { LocalizationService } from './infrastructure/services/localization.service';
import { IConditionRegistry } from './domain/ports/condition-registry.interface';
import { ILocalizationService } from './domain/ports/localization-service.interface';
import * as CoreEvaluators from './infrastructure/evaluators/core-evaluators';

@Module({
  providers: [
    PropertyResolver,
    ConditionResolver,
    LocalizationService,
    {
      provide: 'IConditionRegistry',
      useClass: ConditionRegistry,
    },
    {
      provide: 'IConditionResolver',
      useClass: ConditionResolver,
    },
    {
      provide: 'ILocalizationService',
      useClass: LocalizationService,
    },
  ],
  exports: [
    PropertyResolver,
    ConditionResolver,
    'IConditionRegistry',
    'IConditionResolver',
    'ILocalizationService',
  ],
})
export class ConditionModule implements OnModuleInit {
  constructor(
    @Inject('IConditionRegistry')
    private readonly registry: IConditionRegistry,
    @Inject('ILocalizationService')
    private readonly localization: ILocalizationService,
  ) {}

  onModuleInit() {
    this.registry.registerEvaluator(new CoreEvaluators.EqualsEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.EqualsAliasEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.NotEqualsEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.NotEqualsAliasEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.GreaterThanEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.GreaterThanAliasEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.GreaterThanOrEqualEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.GreaterThanOrEqualAliasEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.LessThanEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.LessThanAliasEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.LessThanOrEqualEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.LessThanOrEqualAliasEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.BetweenEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.ContainsEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.StartsWithEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.EndsWithEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.InEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.NotInEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.MatchRegexEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.IsEmptyEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.IsNotEmptyEvaluator());
    this.registry.registerEvaluator(new CoreEvaluators.DayOfWeekEvaluator(this.localization));
    this.registry.registerEvaluator(new CoreEvaluators.TimeWindowEvaluator());
  }
}
