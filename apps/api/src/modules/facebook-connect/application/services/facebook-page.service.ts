import { Injectable } from "@nestjs/common"
import { FacebookPageRepository } from "../../infrastructure/facebook-page.repository"
import { FacebookPage } from "../../domain/facebook-page.model"

@Injectable()
export class FacebookPageService {
  constructor(private readonly facebookPageRepository: FacebookPageRepository) {}

  public async getPages(): Promise<FacebookPage[]> {
    return this.facebookPageRepository.findAll()
  }

  public async connectPage(pageId: string, name: string, token: string, accountId: string): Promise<FacebookPage> {
    const page: FacebookPage = {
      id: `page-${Date.now()}`,
      pageId,
      name,
      accessTokenEncrypted: `enc-${token}`,
      accountId,
      createdAt: new Date(),
    }
    return this.facebookPageRepository.save(page)
  }

  public async disconnectPage(id: string): Promise<void> {
    await this.facebookPageRepository.remove(id)
  }

  public async getPagesByAccount(accountId: string): Promise<FacebookPage[]> {
    return this.facebookPageRepository.findByAccountId(accountId)
  }
}
