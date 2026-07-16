import { Response } from 'express';
import { TelemetryService } from '../services/telemetry.service';
import { HealthService } from '../services/health.service';
export declare class ObservabilityController {
    private readonly telemetryService;
    private readonly healthService;
    constructor(telemetryService: TelemetryService, healthService: HealthService);
    getMetrics(res: Response): void;
    getHealth(): Promise<any>;
    getLiveness(): {
        status: string;
        heartbeat: boolean;
    };
    getReadiness(res: Response): Promise<void>;
}
