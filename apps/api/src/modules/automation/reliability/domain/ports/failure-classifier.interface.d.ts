export interface FailureClassificationResult {
    category: 'AUTHORIZATION' | 'VALIDATION' | 'CONFIGURATION' | 'RATE_LIMIT' | 'NETWORK' | 'DATABASE' | 'TIMEOUT' | 'TRANSIENT' | 'UNKNOWN';
    retryable: boolean;
    reason: string;
    recommendedPolicy: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
export interface IFailureClassifier {
    classifyFailure(error: any): FailureClassificationResult;
}
