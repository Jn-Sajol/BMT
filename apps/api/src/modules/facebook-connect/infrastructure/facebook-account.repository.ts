import { Injectable } from "@nestjs/common"
import { FacebookAccount } from "../domain/facebook-account.model"

@Injectable()
export class FacebookAccountRepository {
  private accounts: FacebookAccount[] = []

  public async save(account: FacebookAccount): Promise<FacebookAccount> {
    const idx = this.accounts.findIndex((a) => a.id === account.id)
    if (idx >= 0) {
      this.accounts[idx] = account
    } else {
      this.accounts.push(account)
    }
    return account
  }

  public async findById(id: string): Promise<FacebookAccount | null> {
    return this.accounts.find((a) => a.id === id) || null
  }

  public async findAll(): Promise<FacebookAccount[]> {
    return this.accounts
  }

  public async remove(id: string): Promise<void> {
    this.accounts = this.accounts.filter((a) => a.id !== id)
  }
}
