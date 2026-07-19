import { Controller, Get, Post, Body, Param } from "@nestjs/common"
import { FacebookAccountService } from "../application/services/facebook-account.service"
import { FacebookPageService } from "../application/services/facebook-page.service"
import { FacebookTokenService } from "../application/services/facebook-token.service"

@Controller("facebook-connect")
export class FacebookConnectController {
  constructor(
    private readonly facebookAccountService: FacebookAccountService,
    private readonly facebookPageService: FacebookPageService,
    private readonly facebookTokenService: FacebookTokenService
  ) {}

  @Get("accounts")
  public async getAccounts() {
    return this.facebookAccountService.getAccounts()
  }

  @Get("pages")
  public async getPages() {
    return this.facebookPageService.getPages()
  }

  @Get("permissions/:id")
  public async getPermissions(@Param("id") id: string) {
    return this.facebookTokenService.getPermissions(id)
  }

  @Post("connect/account")
  public async connectAccount(
    @Body("fbUserId") fbUserId: string,
    @Body("name") name: string,
    @Body("token") token: string,
    @Body("expiresMs") expiresMs: number
  ) {
    return this.facebookAccountService.connectAccount(fbUserId, name, token, expiresMs)
  }

  @Post("connect/page")
  public async connectPage(
    @Body("pageId") pageId: string,
    @Body("name") name: string,
    @Body("token") token: string,
    @Body("accountId") accountId: string
  ) {
    return this.facebookPageService.connectPage(pageId, name, token, accountId)
  }

  @Post("disconnect/:id")
  public async disconnect(@Param("id") id: string) {
    await this.facebookAccountService.disconnectAccount(id)
    return { success: true }
  }

  @Post("refresh-token/:id")
  public async refreshToken(@Param("id") id: string) {
    return this.facebookTokenService.refreshAccountToken(id)
  }

  @Get("status/:id")
  public async getStatus(@Param("id") id: string) {
    return this.facebookTokenService.checkTokenStatus(id)
  }
}
