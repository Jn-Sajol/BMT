import { ConsoleLogger } from '@nestjs/common';
import { ILogger } from './logger.interface';
export declare class AppLogger extends ConsoleLogger implements ILogger {
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
}
