import { NestModule, MiddlewareConsumer } from '@nestjs/common';
export declare class ObservabilityModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
