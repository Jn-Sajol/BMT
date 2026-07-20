import { Injectable } from "@nestjs/common"
import { InstagramProfile } from "../domain/instagram.model"

@Injectable()
export class InstagramProfileRepository {
  private profiles: InstagramProfile[] = []

  public async save(profile: InstagramProfile): Promise<InstagramProfile> {
    const idx = this.profiles.findIndex((p) => p.id === profile.id)
    if (idx >= 0) {
      this.profiles[idx] = profile
    } else {
      this.profiles.push(profile)
    }
    return profile
  }

  public async saveAll(profiles: InstagramProfile[]): Promise<InstagramProfile[]> {
    for (const p of profiles) {
      await this.save(p)
    }
    return this.profiles
  }

  public async findById(id: string): Promise<InstagramProfile | null> {
    return this.profiles.find((p) => p.id === id) || null
  }

  public async findAll(): Promise<InstagramProfile[]> {
    return this.profiles
  }
}
