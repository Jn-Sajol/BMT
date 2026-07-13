import { Injectable } from '@nestjs/common';

export interface ExplainabilityModel {
  metricsEvaluated: Record<string, number>;
  thresholds: Record<string, number>;
  historicalComparison: string;
  reasoning: string;
  confidenceScore: number;
  expectedImpact: string;
}

@Injectable()
export class RecommendationExplainabilityService {
  generatePayload(
    metricsEvaluated: Record<string, number>,
    thresholds: Record<string, number>,
    reasoning: string,
    confidence: number,
    impact: string,
  ): ExplainabilityModel {
    return {
      metricsEvaluated,
      thresholds,
      historicalComparison: 'CPA has risen by 22% over the last 7-day average comparison window.',
      reasoning,
      confidenceScore: confidence,
      expectedImpact: impact,
    };
  }
}
