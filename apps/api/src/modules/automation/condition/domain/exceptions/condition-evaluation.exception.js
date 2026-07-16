"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionEvaluationException = void 0;
const common_1 = require("@nestjs/common");
class ConditionEvaluationException extends common_1.HttpException {
    metadata;
    constructor(message, metadata) {
        super({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            message: `Condition Evaluation Failed: ${message}`,
            error: 'ConditionEvaluationException',
            metadata,
        }, common_1.HttpStatus.BAD_REQUEST);
        this.metadata = metadata;
    }
}
exports.ConditionEvaluationException = ConditionEvaluationException;
//# sourceMappingURL=condition-evaluation.exception.js.map