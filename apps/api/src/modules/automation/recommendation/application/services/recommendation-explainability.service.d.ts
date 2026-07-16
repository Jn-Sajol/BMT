export interface ExplainabilityModel {
    metricsEvaluated: Record<string, number>;
    thresholds: Record<string, number>;
    historicalComparison: string;
    reasoning: string;
    confidenceScore: number;
    expectedImpact: string;
}
export declare class RecommendationExplainabilityService {
    generatePayload(metricsEvaluated: Record<string, number>, thresholds: Record<string, number>, reasoning: string, confidence: number, impact: string): ExplainabilityModel;
}
