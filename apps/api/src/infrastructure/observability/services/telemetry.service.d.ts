export interface MetricDefinition {
    name: string;
    help: string;
    type: 'counter' | 'gauge' | 'histogram';
    labels?: string[];
}
export declare class TelemetryService {
    private metrics;
    private definitions;
    constructor();
    register(def: MetricDefinition): void;
    increment(name: string, value?: number, labels?: Record<string, string>): void;
    setGauge(name: string, value: number, labels?: Record<string, string>): void;
    recordHistogram(name: string, value: number, labels?: Record<string, string>): void;
    getPrometheusMetrics(): string;
    private labelsEqual;
}
