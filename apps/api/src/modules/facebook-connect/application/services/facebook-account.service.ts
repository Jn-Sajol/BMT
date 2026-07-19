import { Injectable, NotFoundException } from "@nestjs/common"
import { FacebookAccountRepository } from "../../infrastructure/facebook-account.repository"
import { FacebookAccount } from "../../domain/facebook-account.model"

@Injectable()
export class FacebookAccountService {
  constructor(private readonly facebookAccountRepository: FacebookAccountRepository) {}

  public async getAccounts(): Promise<FacebookAccount[]> {
    return this.facebookAccountRepository.findAll()
  }

  public async connectAccount(fbUserId: string, name: string, token: string, expiresMs: number): Promise<FacebookAccount> {
    const account: FacebookAccount = {
      id: `acc-${Date.now()}`,
      fbUserId,
      name,
      accessTokenEncrypted: `enc-${token}`, // In production, wraps security-vault encryption
      expiresAt: new Date(Date.now() + expiresMs),
      createdAt: new Date(),
    }
    return this.facebookAccountRepository.save(account)
  }

  public async disconnectAccount(id: string): Promise<void> {
    const acc = await this.facebookAccountRepository.findById(id)
    if (!acc) {
      throw new NotFoundException("Connected Facebook Account not found.")
    }
    await this.facebookAccountRepository.remove(id)
  }

  public async getAccountById(id: string): Promise<FacebookAccount | null> {
    return this.facebookAccountRepository.findById(id)
  }
}
