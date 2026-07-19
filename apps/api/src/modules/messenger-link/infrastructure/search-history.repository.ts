import { Injectable } from "@nestjs/common"
import { LinkSearchHistory } from "../domain/messenger-link.model"

@Injectable()
export class SearchHistoryRepository {
  private history: LinkSearchHistory[] = []

  public async save(sh: LinkSearchHistory): Promise<LinkSearchHistory> {
    this.history.push(sh)
    return sh
  }

  public async findAll(): Promise<LinkSearchHistory[]> {
    return this.history
  }
}
