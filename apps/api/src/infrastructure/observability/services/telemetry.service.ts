import { Injectable } from '@nestjs/common';

export interface MetricDefinition {
  name: string;
  help: string;
  type: 'counter' | 'gauge' | 'histogram';
  labels?: string[];
}

@Injectable()
export class TelemetryService {
  private metrics = new Map<string, { value: number; labels?: Record<string, string> }[]>();
  private definitions = new Map<string, MetricDefinition>();

  constructor() {
    this.register({ name: 'http_requests_total', help: 'Total number of HTTP requests processed', type: 'counter', labels: ['method', 'route', 'status'] });
    this.register({ name: 'http_request_duration_seconds', help: 'Latency of HTTP requests in seconds', type: 'histogram', labels: ['method', 'route'] });
    this.register({ name: 'http_errors_total', help: 'Total count of API error occurrences', type: 'counter', labels: ['status'] });
    this.register({ name: 'queue_depth', help: 'Current number of items waiting in worker queues', type: 'gauge', labels: ['queueName'] });
    this.register({ name: 'notifications_processed_total', help: 'Total notifications sent', type: 'counter', labels: ['channel'] });
    this.register({ name: 'recommendations_generated_total', help: 'Total optimization recommendations generated', type: 'counter', labels: ['provider'] });
    this.register({ name: 'marketplace_installs_total', help: 'Total marketplace templates installed', type: 'counter' });
    this.register({ name: 'workflow_executions_total', help: 'Total automation workflow executions run', type: 'counter', labels: ['status'] });
    this.register({ name: 'database_query_duration_seconds', help: 'Database query execution latency', type: 'histogram' });
    this.register({ name: 'worker_processing_time_seconds', help: 'Worker execution processing time', type: 'histogram', labels: ['workerName'] });
  }

  register(def: MetricDefinition) {
    this.definitions.set(def.name, def);
    this.metrics.set(def.name, []);
  }

  increment(name: string, value: number = 1, labels?: Record<string, string>) {
    const list = this.metrics.get(name) || [];
    const index = list.findIndex(item => this.labelsEqual(item.labels, labels));
    if (index > -1) {
      list[index].value += value;
    } else {
      list.push({ value, labels });
    }
    this.metrics.set(name, list);
  }

  setGauge(name: string, value: number, labels?: Record<string, string>) {
    const list = this.metrics.get(name) || [];
    const index = list.findIndex(item => this.labelsEqual(item.labels, labels));
    if (index > -1) {
      list[index].value = value;
    } else {
      list.push({ value, labels });
    }
    this.metrics.set(name, list);
  }

  recordHistogram(name: string, value: number, labels?: Record<string, string>) {
    this.increment(name, value, labels);
  }

  getPrometheusMetrics(): string {
    let output = '';
    for (const [name, def] of this.definitions.entries()) {
      output += `# HELP ${name} ${def.help}\n`;
      output += `# TYPE ${name} ${def.type}\n`;
      
      const values = this.metrics.get(name) || [];
      if (values.length === 0) {
        output += `${name} 0\n`;
      } else {
        for (const item of values) {
          const labelStr = item.labels 
            ? '{' + Object.entries(item.labels).map(([k, v]) => `${k}="${v}"`).join(',') + '}'
            : '';
          output += `${name}${labelStr} ${item.value}\n`;
        }
      }
      output += '\n';
    }
    return output;
  }

  private labelsEqual(a?: Record<string, string>, b?: Record<string, string>): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => a[key] === b[key]);
  }
}
