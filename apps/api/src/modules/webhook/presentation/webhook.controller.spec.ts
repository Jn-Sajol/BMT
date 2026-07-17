import 'reflect-metadata';
import { WebhookController } from './webhook.controller';
import { WebhookDispatcher } from '../application/services/webhook-dispatcher.service';
import { ForbiddenException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('WebhookController Unit Tests', () => {
  let controller: WebhookController;
  let mockDispatcher: jest.Mocked<WebhookDispatcher>;

  beforeEach(() => {
    mockDispatcher = {
      dispatch: jest.fn().mockResolvedValue(undefined),
    } as any;
    controller = new WebhookController(mockDispatcher);
    process.env.META_WEBHOOK_VERIFY_TOKEN = 'test_token';
    process.env.META_APP_SECRET = 'test_secret';
  });

  it('should verify the subscription token successfully', () => {
    const challenge = 'challenge123';
    const result = controller.verify('subscribe', 'test_token', challenge);
    expect(result).toBe(challenge);
  });

  it('should throw ForbiddenException if verify token mismatches', () => {
    expect(() => {
      controller.verify('subscribe', 'wrong_token', 'challenge123');
    }).toThrow(ForbiddenException);
  });

  it('should validate signature and dispatch Meta events successfully', async () => {
    const payload = { entry: [{ id: 'evt-100', changes: [{ field: 'campaigns' }] }] };
    const bodyStr = JSON.stringify(payload);

    // Compute expected HMAC SHA-256 signature
    const signatureHash = crypto
      .createHmac('sha256', 'test_secret')
      .update(bodyStr)
      .digest('hex');

    const result = await controller.handle(
      'meta',
      `sha256=${signatureHash}`,
      { rawBody: Buffer.from(bodyStr, 'utf8') },
      payload,
    );

    expect(result.success).toBe(true);
    expect(mockDispatcher.dispatch).toHaveBeenCalledWith('meta', 'evt-100', payload);
  });

  it('should reject requests with invalid signature values', async () => {
    const payload = { entry: [{ id: 'evt-100' }] };
    await expect(
      controller.handle('meta', 'sha256=invalidhashvalue', { rawBody: Buffer.from(JSON.stringify(payload)) }, payload),
    ).rejects.toThrow(ForbiddenException);
  });
});
