import { Injectable } from "@nestjs/common"
import { CommentHistory } from "../domain/link-comment.model"

@Injectable()
export class CommentHistoryRepository {
  private history: CommentHistory[] = []

  public async save(h: CommentHistory): Promise<CommentHistory> {
    this.history.push(h)
    return h
  }

  public async findAll(): Promise<CommentHistory[]> {
    return this.history
  }
}
