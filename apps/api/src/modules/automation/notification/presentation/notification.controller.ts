import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Inject, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AuthGuard } from '../../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Automation Notification Engine')
@Controller('api/automation/notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List recent notification logs' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getNotifications(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationNotification.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Get('history')
  @ApiOperation({ summary: 'List delivery logs' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationNotificationDelivery.findMany({
      where: {
        notification: { workspaceId },
      },
      include: { notification: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Get('templates')
  @ApiOperation({ summary: 'List template definitions' })
  async getTemplates() {
    return await this.prisma.automationNotificationTemplate.findMany();
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create alert template' })
  async createTemplate(
    @Body('name') name: string,
    @Body('subject') subject: string,
    @Body('body') body: string,
  ) {
    return await this.prisma.automationNotificationTemplate.create({
      data: { name, subject, body },
    });
  }

  @Put('templates/:id')
  @ApiOperation({ summary: 'Update alert template' })
  async updateTemplate(
    @Param('id') id: string,
    @Body('subject') subject: string,
    @Body('body') body: string,
  ) {
    return await this.prisma.automationNotificationTemplate.update({
      where: { id },
      data: { subject, body, version: { increment: 1 } },
    });
  }

  @Delete('templates/:id')
  @ApiOperation({ summary: 'Delete alert template' })
  async deleteTemplate(@Param('id') id: string) {
    await this.prisma.automationNotificationTemplate.delete({
      where: { id },
    });
    return { success: true };
  }

  @Get('preferences')
  @ApiOperation({ summary: 'List workspace alert settings' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getPreferences(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    return await this.prisma.automationNotificationPreference.findMany({
      where: { workspaceId, userId },
    });
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update channel preference configuration' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async updatePreferences(
    @Body('channel') channel: string,
    @Body('enabled') enabled: boolean,
    @Body('severityLevel') severityLevel: string,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';

    return await this.prisma.automationNotificationPreference.upsert({
      where: {
        workspaceId_userId_channel: { workspaceId, userId, channel: channel.toUpperCase() },
      },
      update: { enabled, severityLevel },
      create: { workspaceId, userId, channel: channel.toUpperCase(), enabled, severityLevel },
    });
  }

  @Get('providers')
  @ApiOperation({ summary: 'List active notification providers' })
  async getProviders() {
    return await this.prisma.automationNotificationProvider.findMany();
  }

  @Post('providers')
  @ApiOperation({ summary: 'Add provider connection' })
  async createProvider(
    @Body('name') name: string,
    @Body('config') config: any,
  ) {
    return await this.prisma.automationNotificationProvider.create({
      data: { name: name.toUpperCase(), config: config || {}, enabled: true },
    });
  }

  @Put('providers/:id')
  @ApiOperation({ summary: 'Update provider configurations' })
  async updateProvider(
    @Param('id') id: string,
    @Body('config') config: any,
    @Body('enabled') enabled: boolean,
  ) {
    return await this.prisma.automationNotificationProvider.update({
      where: { id },
      data: { config, enabled },
    });
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch test notification alert' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async testNotification(
    @Body('channel') channel: string,
    @Body('recipient') recipient: string,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    
    const notification = await this.prisma.automationNotification.create({
      data: {
        workspaceId,
        eventName: 'Test Notification Triggered',
        payload: { channel, recipient },
        severity: 'INFO',
      },
    });

    const delivery = await this.prisma.automationNotificationDelivery.create({
      data: {
        notificationId: notification.id,
        channel: channel.toUpperCase(),
        recipient,
        status: 'PENDING',
      },
    });

    return { success: true, notificationId: notification.id, deliveryId: delivery.id };
  }

  @Get('health')
  @ApiOperation({ summary: 'Query engine parameters queue depths and failures' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async checkHealth(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];

    const pendingCount = await this.prisma.automationNotificationDelivery.count({
      where: {
        status: 'PENDING',
        notification: { workspaceId },
      },
    });

    const failedCount = await this.prisma.automationNotificationDelivery.count({
      where: {
        status: 'FAILED',
        notification: { workspaceId },
      },
    });

    const sentCount = await this.prisma.automationNotificationDelivery.count({
      where: {
        status: 'SENT',
        notification: { workspaceId },
      },
    });

    return {
      status: 'HEALTHY',
      pendingDeliveries: pendingCount,
      failedDeliveries: failedCount,
      deliveredNotifications: sentCount,
      activeChannels: ['EMAIL', 'WEBHOOK', 'IN_APP', 'SLACK'],
    };
  }
}
