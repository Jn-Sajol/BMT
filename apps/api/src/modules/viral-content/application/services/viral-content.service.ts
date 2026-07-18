import { Injectable } from "@nestjs/common"
import { ViralContentRepository } from "../../infrastructure/viral-content.repository"
import { ViralContentResult, ViralSearchQuery } from "../../domain/viral-search.model"

@Injectable()
export class ViralContentService {
  constructor(private readonly viralContentRepository: ViralContentRepository) {}

  public async findViralContent(query: ViralSearchQuery): Promise<ViralContentResult[]> {
    return this.viralContentRepository.search(
      query.platform,
      query.category,
      query.country
    )
  }
}
