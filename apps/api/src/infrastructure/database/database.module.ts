import { Module, Global } from '@nestjs/common';
import { PrismaClientService } from './prisma-client.service';
import { extendPrismaClient } from './prisma-extensions';
import { UserRepository } from './repositories/user.repository';
import { UserSessionRepository } from './repositories/user-session.repository';
import { UserInvitationRepository } from './repositories/user-invitation.repository';
import { OrganizationRepository } from './repositories/organization.repository';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { OrganizationMemberRepository } from './repositories/organization-member.repository';
import { VerificationRepository } from './repositories/verification.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { RoleRepository } from './repositories/role.repository';
import { MetaConnectionRepository } from './repositories/meta-connection.repository';
import { MetaBusinessRepository } from './repositories/meta-business.repository';
import { MetaPageRepository } from './repositories/meta-page.repository';
import { MetaAdAccountRepository } from './repositories/meta-ad-account.repository';
import { MetaInstagramAccountRepository } from './repositories/meta-instagram.repository';
import { MetaPixelRepository } from './repositories/meta-pixel.repository';
import { MetaCatalogRepository } from './repositories/meta-catalog.repository';
import { MetaSyncHistoryRepository } from './repositories/meta-sync-history.repository';
import { MetaBusinessPageRepository } from './repositories/meta-business-page.repository';
import { MetaBusinessAdAccountRepository } from './repositories/meta-business-ad-account.repository';
import { MetaBusinessPixelRepository }    from './repositories/meta-business-pixel.repository';
import { MetaBusinessCatalogRepository }  from './repositories/meta-business-catalog.repository';
import { MetaPageInstagramRepository }    from './repositories/meta-page-instagram.repository';
import { MetaAdAccountPixelRepository }   from './repositories/meta-ad-account-pixel.repository';
import { CampaignRepository } from './repositories/campaign.repository';
import { AdSetRepository } from './repositories/ad-set.repository';
import { AdCreativeRepository } from './repositories/ad-creative.repository';
import { AdRepository } from './repositories/ad.repository';
import { MediaRepository } from './repositories/media.repository';
import { CampaignInsightRepository } from './repositories/campaign-insight.repository';
import { AdSetInsightRepository } from './repositories/adset-insight.repository';
import { AdInsightRepository } from './repositories/ad-insight.repository';
import { MetaInsightRepository } from './repositories/meta-insight.repository';
import { InsightSyncHistoryRepository } from './repositories/insight-sync-history.repository';
import { StatusSyncHistoryRepository } from './repositories/status-sync-history.repository';
import { MetaStatusRepository } from './repositories/meta-status.repository';
import { CampaignLifecycleRepository } from './repositories/campaign-lifecycle.repository';
import { AdSetLifecycleRepository } from './repositories/adset-lifecycle.repository';
import { AdCreativeLifecycleRepository } from './repositories/adcreative-lifecycle.repository';
import { AdLifecycleRepository } from './repositories/ad-lifecycle.repository';
import { WebhookInboxRepository } from './repositories/webhook-inbox.repository';
import { JobRepository } from './repositories/job.repository';
import { MetaOutboxRepository } from './repositories/meta-outbox.repository';
import { AutomationRuleRepository } from './repositories/automation-rule.repository';
import { PRISMA_CLIENT } from './constants';

@Global()
@Module({
  providers: [
    PrismaClientService,
    {
      provide: PRISMA_CLIENT,
      useFactory: (prismaService: PrismaClientService) => {
        return extendPrismaClient(prismaService);
      },
      inject: [PrismaClientService],
    },
    UserRepository,
    UserSessionRepository,
    UserInvitationRepository,
    OrganizationRepository,
    WorkspaceRepository,
    OrganizationMemberRepository,
    VerificationRepository,
    PasswordResetRepository,
    PermissionRepository,
    RoleRepository,
    MetaConnectionRepository,
    MetaBusinessRepository,
    MetaPageRepository,
    MetaAdAccountRepository,
    MetaInstagramAccountRepository,
    MetaPixelRepository,
    MetaCatalogRepository,
    MetaSyncHistoryRepository,
    MetaBusinessPageRepository,
    MetaBusinessAdAccountRepository,
    MetaBusinessPixelRepository,
    MetaBusinessCatalogRepository,
    MetaPageInstagramRepository,
    MetaAdAccountPixelRepository,
    CampaignRepository,
    AdSetRepository,
    AdCreativeRepository,
    AdRepository,
    MediaRepository,
    CampaignInsightRepository,
    AdSetInsightRepository,
    AdInsightRepository,
    MetaInsightRepository,
    InsightSyncHistoryRepository,
    StatusSyncHistoryRepository,
    MetaStatusRepository,
    CampaignLifecycleRepository,
    AdSetLifecycleRepository,
    AdCreativeLifecycleRepository,
    AdLifecycleRepository,
    WebhookInboxRepository,
    JobRepository,
    MetaOutboxRepository,
    AutomationRuleRepository,
  ],
  exports: [
    PRISMA_CLIENT,
    UserRepository,
    UserSessionRepository,
    UserInvitationRepository,
    OrganizationRepository,
    WorkspaceRepository,
    OrganizationMemberRepository,
    VerificationRepository,
    PasswordResetRepository,
    PermissionRepository,
    RoleRepository,
    MetaConnectionRepository,
    MetaBusinessRepository,
    MetaPageRepository,
    MetaAdAccountRepository,
    MetaInstagramAccountRepository,
    MetaPixelRepository,
    MetaCatalogRepository,
    MetaSyncHistoryRepository,
    MetaBusinessPageRepository,
    MetaBusinessAdAccountRepository,
    MetaBusinessPixelRepository,
    MetaBusinessCatalogRepository,
    MetaPageInstagramRepository,
    MetaAdAccountPixelRepository,
    CampaignRepository,
    AdSetRepository,
    AdCreativeRepository,
    AdRepository,
    MediaRepository,
    CampaignInsightRepository,
    AdSetInsightRepository,
    AdInsightRepository,
    MetaInsightRepository,
    InsightSyncHistoryRepository,
    StatusSyncHistoryRepository,
    MetaStatusRepository,
    CampaignLifecycleRepository,
    AdSetLifecycleRepository,
    AdCreativeLifecycleRepository,
    AdLifecycleRepository,
    WebhookInboxRepository,
    JobRepository,
    MetaOutboxRepository,
    AutomationRuleRepository,
  ],
})
export class DatabaseModule {}
