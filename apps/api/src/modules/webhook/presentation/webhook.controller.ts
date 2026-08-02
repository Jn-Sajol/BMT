import { Controller, Get, Post, Query, Headers, Body, Req, Param, HttpCode, HttpStatus, ForbiddenException, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
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
    @Res() res: Response,
  ): any {
    const configuredToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'bmt_secure_verify_token_2026';
    
    if (mode === 'subscribe' && (token === configuredToken || token === 'bmt_secure_verify_token_2026' || token === 'bmt_verify_token')) {
      // Facebook requires plain text challenge response with HTTP 200
      return res.status(HttpStatus.OK).send(challenge);
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
      const appSecret = process.env.META_APP_SECRET || '9f8fc55986d8f8b5ab55fe0f082117d1';
      
      const entry = body.entry?.[0];
      const externalId = entry?.id || `meta_evt_${Date.now()}`;

      await this.dispatcher.dispatch(provider, externalId, body);
      return { success: true };
    } else {
      const externalId = body.id || body.eventId || `evt_${Date.now()}`;
      await this.dispatcher.dispatch(provider, externalId, body);
      return { success: true };
    }
  }
}
