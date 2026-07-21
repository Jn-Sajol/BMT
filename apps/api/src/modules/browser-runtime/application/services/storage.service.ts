import { Injectable } from "@nestjs/common"

export interface StorageMetadata {
  id: string
  profileId: string
  cookiesCount: number
  localStorageKeys: string[]
  sessionStorageKeys: string[]
  indexedDbSizeKb: number
  cacheSizeKb: number
  updatedAt: Date
}

@Injectable()
export class StorageService {
  private metadataStore = new Map<string, StorageMetadata>()

  public async getStorageMetadata(profileId: string): Promise<StorageMetadata> {
    const existing = this.metadataStore.get(profileId)
    if (existing) return existing

    const initial: StorageMetadata = {
      id: `store-${Date.now()}`,
      profileId,
      cookiesCount: 15,
      localStorageKeys: ["theme", "user_preferences"],
      sessionStorageKeys: ["current_tab"],
      indexedDbSizeKb: 120,
      cacheSizeKb: 450,
      updatedAt: new Date(),
    }
    this.metadataStore.set(profileId, initial)
    return initial
  }

  public async encryptCookieData(rawCookies: string): Promise<string> {
    // Standard secure encryption mock
    const key = "bmt-session-secret-key"
    console.log(`[StorageService] Encrypting cookies payload using key: ${key}`)
    return `enc-aes-256:${Buffer.from(rawCookies).toString("base64")}`
  }

  public async decryptCookieData(encryptedData: string): Promise<string> {
    if (!encryptedData.startsWith("enc-aes-256:")) {
      throw new Error("Invalid cookie encryption format.")
    }
    console.log(`[StorageService] Decrypting cookies payload...`)
    const base64 = encryptedData.substring("enc-aes-256:".length)
    return Buffer.from(base64, "base64").toString("utf-8")
  }
}
