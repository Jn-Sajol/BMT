import { Injectable, NotFoundException } from "@nestjs/common"
import { IBrowserProfileManager } from "../../domain/browser-runtime.interface"
import { BrowserProfileRepository } from "../../infrastructure/browser-profile.repository"
import { BrowserProfile } from "../../domain/browser-profile.model"

@Injectable()
export class BrowserProfileService implements IBrowserProfileManager {
  constructor(private readonly browserProfileRepository: BrowserProfileRepository) {}

  public async createProfile(profile: BrowserProfile): Promise<BrowserProfile> {
    return this.browserProfileRepository.save(profile)
  }

  public async loadProfile(id: string): Promise<BrowserProfile | null> {
    return this.browserProfileRepository.findById(id)
  }

  public async archiveProfile(id: string): Promise<BrowserProfile> {
    const profile = await this.browserProfileRepository.findById(id)
    if (!profile) {
      throw new NotFoundException(`Browser profile with ID "${id}" not found.`)
    }
    profile.status = "Archived"
    return this.browserProfileRepository.save(profile)
  }

  public async listProfiles(): Promise<BrowserProfile[]> {
    return this.browserProfileRepository.findAll()
  }

  public async loadMockProfiles(): Promise<BrowserProfile[]> {
    const mocks: BrowserProfile[] = [
      {
        id: "prof-1",
        workspaceId: "ws-1",
        userId: "u-1",
        browserEngine: "Chromium",
        profileName: "Facebook Poster Profile",
        storageLocation: "s3://bmt-profiles-bucket/prof-1",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    return this.browserProfileRepository.saveAll(mocks)
  }
}
