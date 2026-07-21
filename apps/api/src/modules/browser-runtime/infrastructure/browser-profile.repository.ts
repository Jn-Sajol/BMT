import { Injectable } from "@nestjs/common"
import { BrowserProfile } from "../domain/browser-profile.model"

@Injectable()
export class BrowserProfileRepository {
  private profiles: BrowserProfile[] = []

  public async save(profile: BrowserProfile): Promise<BrowserProfile> {
    const idx = this.profiles.findIndex((p) => p.id === profile.id)
    if (idx >= 0) {
      this.profiles[idx] = profile
    } else {
      this.profiles.push(profile)
    }
    return profile
  }

  public async saveAll(profiles: BrowserProfile[]): Promise<BrowserProfile[]> {
    for (const p of profiles) {
      await this.save(p)
    }
    return this.profiles
  }

  public async findById(id: string): Promise<BrowserProfile | null> {
    return this.profiles.find((p) => p.id === id) || null
  }

  public async findAll(): Promise<BrowserProfile[]> {
    return this.profiles
  }
}
