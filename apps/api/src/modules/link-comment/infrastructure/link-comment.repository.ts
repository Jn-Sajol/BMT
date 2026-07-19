import { Injectable } from "@nestjs/common"
import { LinkComment } from "../domain/link-comment.model"

@Injectable()
export class LinkCommentRepository {
  private comments: LinkComment[] = []

  public async save(comment: LinkComment): Promise<LinkComment> {
    const idx = this.comments.findIndex((c) => c.id === comment.id)
    if (idx >= 0) {
      this.comments[idx] = comment
    } else {
      this.comments.push(comment)
    }
    return comment
  }

  public async saveAll(items: LinkComment[]): Promise<LinkComment[]> {
    for (const c of items) {
      await this.save(c)
    }
    return items
  }

  public async findById(id: string): Promise<LinkComment | null> {
    return this.comments.find((c) => c.id === id) || null
  }

  public async findAll(): Promise<LinkComment[]> {
    return this.comments
  }
}
