import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CorrelationService, RequestContextStore } from '../services/correlation.service';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly correlationService: CorrelationService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();
    const requestId = randomUUID();
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.headers['x-user-id'] as string;

    const store: RequestContextStore = {
      correlationId,
      requestId,
      workspaceId,
      userId,
    };

    res.setHeader('x-correlation-id', correlationId);

    this.correlationService.runWithContext(store, () => {
      next();
    });
  }
}
