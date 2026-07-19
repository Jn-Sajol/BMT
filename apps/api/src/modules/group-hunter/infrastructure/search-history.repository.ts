import { Injectable } from "@nestjs/common"
import { SearchHistory } from "../domain/group-hunter.model"

@Injectable()
export class SearchHistoryRepository {
  private history: SearchHistory[] = []

  public async save(sh: SearchHistory): Promise<SearchHistory> {
    this.history.push(sh)
    return sh
  }

  public async findAll(): Promise<SearchHistory[]> {
    return this.history
  }
}
