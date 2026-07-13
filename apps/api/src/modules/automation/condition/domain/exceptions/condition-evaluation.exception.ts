import { HttpException, HttpStatus } from '@nestjs/common';

export class ConditionEvaluationException extends HttpException {
  constructor(message: string, public readonly metadata: any) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Condition Evaluation Failed: ${message}`,
        error: 'ConditionEvaluationException',
        metadata,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
