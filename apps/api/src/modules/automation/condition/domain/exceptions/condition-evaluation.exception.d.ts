import { HttpException } from '@nestjs/common';
export declare class ConditionEvaluationException extends HttpException {
    readonly metadata: any;
    constructor(message: string, metadata: any);
}
