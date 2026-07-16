import { IFailureClassifier, FailureClassificationResult } from '../../domain/ports/failure-classifier.interface';
export declare class FailureClassifier implements IFailureClassifier {
    classifyFailure(error: any): FailureClassificationResult;
}
