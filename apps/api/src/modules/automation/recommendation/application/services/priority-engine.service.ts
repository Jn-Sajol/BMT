import { Injectable } from '@nestjs/common';

@Injectable()
export class PriorityEngineService {
  calculatePriority(confidenceScore: number, cpaDeviation: number): 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW' {
    const score = confidenceScore * cpaDeviation;
    if (score >= 1.5) return 'CRITICAL';
    if (score >= 1.0) return 'HIGH';
    if (score >= 0.5) return 'NORMAL';
    return 'LOW';
  }
}
