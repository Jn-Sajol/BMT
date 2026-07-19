import { Injectable } from "@nestjs/common"
import { FacebookAccountRepository } from "../../infrastructure/facebook-account.repository"
import { FacebookPermission } from "../../domain/facebook-permission.model"

@Injectable()
export class FacebookTokenService {
  constructor(private readonly facebookAccountRepository: FacebookAccountRepository) {}

  public async checkTokenStatus(id: string): Promise<{ valid: boolean; expiresSeconds: number }> {
    const acc = await this.facebookAccountRepository.findById(id)
    if (!acc) {
      return { valid: false, expiresSeconds: 0 }
    }
    const diff = acc.expiresAt.getTime() - Date.now()
    return {
      valid: diff > 0,
      expiresSeconds: diff > 0 ? Math.floor(diff / 1000) : 0,
    }
  }

  public async getPermissions(id: string): Promise<FacebookPermission[]> {
    return [
      { id: "p-1", name: "pages_show_list", status: "granted", accountId: id },
      { id: "p-2", name: "pages_read_engagement", status: "granted", accountId: id },
      { id: "p-3", name: "pages_manage_posts", status: "granted", accountId: id },
    ]
  }

  public async refreshAccountToken(id: string): Promise<{ success: boolean; newExpiry: Date }> {
    const acc = await this.facebookAccountRepository.findById(id)
    if (!acc) {
      throw new Error("Connected Facebook account not found to refresh token.")
    }
    acc.expiresAt = new Date(Date.now() + 3600 * 1000 * 24 * 60) // Refreshes for 60 days
    await this.facebookAccountRepository.save(acc)
    return { success: true, newExpiry: acc.expiresAt }
  }
}
