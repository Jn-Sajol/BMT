import { Module } from "@nestjs/common"
import { InstagramController } from "./presentation/instagram.controller"
import { InstagramAccountService } from "./application/services/instagram-account.service"
import { InstagramPostService } from "./application/services/instagram-post.service"
import { InstagramInboxService } from "./application/services/instagram-inbox.service"
import { InstagramProfileRepository } from "./infrastructure/instagram-profile.repository"
import { InstagramPostRepository } from "./infrastructure/instagram-post.repository"
import { InstagramDMRepository } from "./infrastructure/instagram-dm.repository"

@Module({
  controllers: [InstagramController],
  providers: [
    InstagramAccountService,
    InstagramPostService,
    InstagramInboxService,
    InstagramProfileRepository,
    InstagramPostRepository,
    InstagramDMRepository,
  ],
  exports: [
    InstagramAccountService,
    InstagramPostService,
    InstagramInboxService,
    InstagramProfileRepository,
    InstagramPostRepository,
    InstagramDMRepository,
  ],
})
export class InstagramModule {}
