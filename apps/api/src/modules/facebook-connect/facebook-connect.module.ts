import { Module } from "@nestjs/common"
import { FacebookConnectController } from "./presentation/facebook-connect.controller"
import { FacebookAccountService } from "./application/services/facebook-account.service"
import { FacebookPageService } from "./application/services/facebook-page.service"
import { FacebookTokenService } from "./application/services/facebook-token.service"
import { FacebookOauthService } from "./application/services/facebook-oauth.service"
import { FacebookAccountRepository } from "./infrastructure/facebook-account.repository"
import { FacebookPageRepository } from "./infrastructure/facebook-page.repository"

@Module({
  controllers: [FacebookConnectController],
  providers: [
    FacebookAccountService,
    FacebookPageService,
    FacebookTokenService,
    FacebookOauthService,
    FacebookAccountRepository,
    FacebookPageRepository,
  ],
  exports: [
    FacebookAccountService,
    FacebookPageService,
    FacebookTokenService,
    FacebookOauthService,
    FacebookAccountRepository,
    FacebookPageRepository,
  ],
})
export class FacebookConnectModule {}
