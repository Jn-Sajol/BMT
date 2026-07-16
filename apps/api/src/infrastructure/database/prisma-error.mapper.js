"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPrismaError = mapPrismaError;
const client_1 = require("@prisma/client");
const app_exceptions_1 = require("../../common/exceptions/app-exceptions");
const base_exception_1 = require("../../common/exceptions/base.exception");
function mapPrismaError(error) {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002': {
                const targets = error.meta?.target || [];
                return new app_exceptions_1.ConflictException(`Unique constraint violation on fields: ${targets.join(', ')}`);
            }
            case 'P2025':
                return new app_exceptions_1.NotFoundException(error.meta?.cause || 'Requested record was not found');
            case 'P2003':
                return new app_exceptions_1.BadRequestException('Foreign key constraint violation. Reference record is invalid.');
            default:
                return new base_exception_1.BaseException(error.message, undefined, 500, [error.code]);
        }
    }
    return error;
}
//# sourceMappingURL=prisma-error.mapper.js.map