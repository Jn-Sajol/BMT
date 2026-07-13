import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { TelemetryService } from '../services/telemetry.service';
import { HealthService } from '../services/health.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Observability & Telemetry')
@Controller('api/observability')
export class ObservabilityController {
  constructor(
    private readonly telemetryService: TelemetryService,
    private readonly healthService: HealthService,
  ) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.status(HttpStatus.OK).send(this.telemetryService.getPrometheusMetrics());
  }

  @Get('health')
  @ApiOperation({ summary: 'Detailed health check log' })
  async getHealth() {
    return await this.healthService.checkFullStatus();
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check heartbeat' })
  getLiveness() {
    return { status: 'UP', heartbeat: true };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check verification' })
  async getReadiness(@Res() res: Response) {
    const isDbReady = await this.healthService.checkDatabase();
    if (isDbReady) {
      res.status(HttpStatus.OK).send({ status: 'READY', database: 'UP' });
    } else {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).send({ status: 'NOT_READY', database: 'DOWN' });
    }
  }
}
