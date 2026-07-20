import { Injectable, NotFoundException } from "@nestjs/common"
import { InstagramProfileRepository } from "../../infrastructure/instagram-profile.repository"
import { InstagramProfile } from "../../domain/instagram.model"

@Injectable()
export class InstagramAccountService {
  constructor(private readonly instagramProfileRepository: InstagramProfileRepository) {}

  public async getProfiles(): Promise<InstagramProfile[]> {
    return this.instagramProfileRepository.findAll()
  }

  public async getProfileById(id: string): Promise<InstagramProfile> {
    const profile = await this.instagramProfileRepository.findById(id)
    if (!profile) {
      throw new NotFoundException("Instagram business profile not found.")
    }
    return profile
  }

  public async linkProfile(igUserId: string, username: string, connectedPageId: string, accessToken: string): Promise<InstagramProfile> {
    const profile: InstagramProfile = {
      id: `ig-prof-${Date.now()}`,
      igUserId,
      username,
      fullName: `${username} Business Account`,
      profilePictureUrl: "https://bmt-cdn-mock.s3.amazonaws.com/profiles/ig-avatar.jpg",
      connectedPageId,
      accessToken,
      followerCount: 4500,
      followingCount: 320,
      createdAt: new Date(),
    }
    return this.instagramProfileRepository.save(profile)
  }

  public async loadMockProfiles(): Promise<InstagramProfile[]> {
    const mocks: InstagramProfile[] = [
      {
        id: "ig-prof-1",
        igUserId: "ig-user-100",
        username: "bmt_marketing_agent",
        fullName: "BMT Marketing Agency Profile",
        profilePictureUrl: "https://bmt-cdn-mock.s3.amazonaws.com/profiles/ig-avatar-1.jpg",
        connectedPageId: "fb-page-100",
        accessToken: "mock-ig-access-token-1",
        followerCount: 12500,
        followingCount: 450,
        createdAt: new Date(),
      },
    ]
    return this.instagramProfileRepository.saveAll(mocks)
  }
}
