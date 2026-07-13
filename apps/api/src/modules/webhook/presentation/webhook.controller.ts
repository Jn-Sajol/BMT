import { Controller, Get, Post, Query, Headers, Body, Req, Param, HttpCode, HttpStatus, ForbiddenException, BadRequestException } from '@nestjs/common';
import { WebhookDispatcher } from '../application/services/webhook-dispatcher.service';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly dispatcher: WebhookDispatcher) {}

  @Get(':provider')
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const configuredToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'bmt_verify_token';
    if (mode === 'subscribe' && token === configuredToken) {
      return challenge;
    }
    throw new ForbiddenException('Verification token mismatch.');
  }

  @Post(':provider')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Param('provider') provider: string,
    @Headers('x-hub-signature-256') signature: string,
    @Req() req: any,
    @Body() body: any,
  ): Promise<{ success: boolean }> {
    if (provider === 'meta') {
      const appSecret = process.env.META_APP_SECRET || 'meta_secret';
      
      if (!signature) {
        throw new ForbiddenException('Missing signature header.');
      }

      const [algo, hash] = signature.split('=');
      if (algo !== 'sha256' || !hash) {
        throw new BadRequestException('Invalid signature format.');
      }

      const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(body);
      const expectedHash = crypto
        .createHmac('sha256', appSecret)
        .update(rawBody)
        .digest('hex');

      const bufferHash = Buffer.from(hash, 'utf8');
      const bufferExpected = Buffer.from(expectedHash, 'utf8');

      if (bufferHash.length !== bufferExpected.length || !crypto.timingSafeEqual(bufferHash, bufferExpected)) {
        throw new ForbiddenException('Invalid webhook signature.');
      }

      const entry = body.entry?.[0];
      const externalId = entry?.id || `meta_evt_${Date.now()}`;

      await this.dispatcher.dispatch(provider, externalId, body);
    } else {
      const externalId = body.id || body.eventId || `evt_${Date.now()}`;
      await this.dispatcher.dispatch(provider, externalId, body);
    }

    return { success: true };
  }
}
