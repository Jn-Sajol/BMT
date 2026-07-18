import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { IdentityModule } from './application/identity.module';
import { SecurityModule } from './infrastructure/security/security.module';
import { AuthModule } from './application/auth/auth.module';
import { RegistrationModule } from './application/registration/registration.module';
import { OrganizationModule } from './application/organization.module';
import { WorkspaceModule } from './application/workspace.module';
import { OrganizationMemberModule } from './application/organization-member.module';
import { VerificationModule } from './application/verification.module';
import { PasswordResetModule } from './application/password-reset.module';
import { RbacModule } from './application/rbac.module';
import { MetaModule } from './modules/meta/meta.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { AutomationModule } from './modules/automation/automation.module';
import { CampaignModule } from './application/campaign/campaign.module';
import { AdSetModule } from './application/adset/adset.module';
import { AdCreativeModule } from './application/adcreative/adcreative.module';
import { AdModule } from './application/ad/ad.module';
import { MediaModule } from './application/media/media.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { RequestContextMiddleware } from './common/context/request-context.middleware';
import { ObservabilityModule } from './infrastructure/observability/observability.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { AIModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PluginsModule } from './modules/plugins/plugins.module';
import { LibraryModule } from './modules/library/library.module';
import { ClickableImageModule } from './modules/clickable-image/clickable-image.module';
import { LandingPageModule } from './modules/landing-page/landing-page.module';
import { ViralContentModule } from './modules/viral-content/viral-content.module';
import { DownloaderModule } from './modules/downloader/downloader.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    HealthModule,
    DatabaseModule,
    IdentityModule,
    SecurityModule,
    AuthModule,
    RegistrationModule,
    OrganizationModule,
    WorkspaceModule,
    OrganizationMemberModule,
    VerificationModule,
    PasswordResetModule,
    RbacModule,
    MetaModule,
    WebhookModule,
    SchedulerModule,
    AutomationModule,
    CampaignModule,
    AdSetModule,
    AdCreativeModule,
    AdModule,
    MediaModule,
    ObservabilityModule,
    WorkflowsModule,
    CollaborationModule,
    AIModule,
    NotificationsModule,
    PluginsModule,
    LibraryModule,
    ClickableImageModule,
    LandingPageModule,
    ViralContentModule,
    DownloaderModule,
    DashboardModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, RequestContextMiddleware)
      .forRoutes('*');
  }
}
