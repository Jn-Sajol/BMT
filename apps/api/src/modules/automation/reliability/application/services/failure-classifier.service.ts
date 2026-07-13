import { Injectable } from '@nestjs/common';
import { IFailureClassifier, FailureClassificationResult } from '../../domain/ports/failure-classifier.interface';

@Injectable()
export class FailureClassifier implements IFailureClassifier {
  classifyFailure(error: any): FailureClassificationResult {
    const message = (error?.message || String(error)).toLowerCase();

    if (message.includes('auth') || message.includes('token') || message.includes('key') || message.includes('unauthorized')) {
      return {
        category: 'AUTHORIZATION',
        retryable: false,
        reason: 'Missing or expired credential validation token.',
        recommendedPolicy: 'NONE',
        severity: 'HIGH',
      };
    }

    if (message.includes('validation') || message.includes('invalid') || message.includes('bad request') || message.includes('required')) {
      return {
        category: 'VALIDATION',
        retryable: false,
        reason: 'Request structural payload failed validation schemas.',
        recommendedPolicy: 'NONE',
        severity: 'MEDIUM',
      };
    }

    if (message.includes('config') || message.includes('missing account') || message.includes('setup')) {
      return {
        category: 'CONFIGURATION',
        retryable: false,
        reason: 'Rule configuration constraints mismatch.',
        recommendedPolicy: 'NONE',
        severity: 'HIGH',
      };
    }

    if (message.includes('rate limit') || message.includes('too many requests') || message.includes('429') || message.includes('throttle')) {
      return {
        category: 'RATE_LIMIT',
        retryable: true,
        reason: 'Provider endpoint throttling limits exceeded.',
        recommendedPolicy: 'EXPONENTIAL_JITTER',
        severity: 'HIGH',
      };
    }

    if (message.includes('network') || message.includes('connection') || message.includes('socket') || message.includes('dns') || message.includes('econnrefused')) {
      return {
        category: 'NETWORK',
        retryable: true,
        reason: 'Transient outbound connection timeout or reset.',
        recommendedPolicy: 'EXPONENTIAL',
        severity: 'MEDIUM',
      };
    }

    if (message.includes('database') || message.includes('prisma') || message.includes('postgres') || message.includes('sql') || message.includes('unique constraint')) {
      return {
        category: 'DATABASE',
        retryable: true,
        reason: 'Internal storage transaction lock or query failure.',
        recommendedPolicy: 'FIXED',
        severity: 'CRITICAL',
      };
    }

    if (message.includes('timeout') || message.includes('deadline') || message.includes('etimedout')) {
      return {
        category: 'TIMEOUT',
        retryable: true,
        reason: 'External HTTP downstream response exceeded threshold deadline.',
        recommendedPolicy: 'EXPONENTIAL',
        severity: 'MEDIUM',
      };
    }

    if (message.includes('transient') || message.includes('temporary') || message.includes('503') || message.includes('502')) {
      return {
        category: 'TRANSIENT',
        retryable: true,
        reason: 'Remote service temporarily unavailable.',
        recommendedPolicy: 'EXPONENTIAL_JITTER',
        severity: 'LOW',
      };
    }

    return {
      category: 'UNKNOWN',
      retryable: true,
      reason: 'Unclassified execution error caught.',
      recommendedPolicy: 'EXPONENTIAL',
      severity: 'HIGH',
    };
  }
}
