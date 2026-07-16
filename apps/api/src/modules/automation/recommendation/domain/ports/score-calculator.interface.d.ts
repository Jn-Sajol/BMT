export interface ScoringInputs {
    performanceScore: number;
    automationHealth: number;
    reliabilityScore: number;
    workflowHealth: number;
    insightFreshness: number;
}
export interface IScoreCalculator {
    calculateScore(inputs: ScoringInputs): number;
}
