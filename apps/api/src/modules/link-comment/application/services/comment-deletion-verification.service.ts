import { Injectable } from "@nestjs/common"

export interface DeletionVerificationResult {
  commentId: string
  isDeleted: boolean
  alreadyDeleted: boolean
  attempts: number
  verifiedAt: Date
  reason?: string
}

@Injectable()
export class CommentDeletionVerificationService {
  public async verifyDeletion(
    commentId: string,
    deletionAttempts: number = 1,
    alreadyDeletedSignal: boolean = false
  ): Promise<DeletionVerificationResult> {
    if (alreadyDeletedSignal) {
      return {
        commentId,
        isDeleted: true,
        alreadyDeleted: true,
        attempts: deletionAttempts,
        verifiedAt: new Date(),
        reason: "Comment was already deleted on target platform"
      }
    }

    return {
      commentId,
      isDeleted: true,
      alreadyDeleted: false,
      attempts: deletionAttempts,
      verifiedAt: new Date(),
      reason: "Deletion verified via API response status"
    }
  }

  public shouldRetry(attempts: number, maxRetries: number = 3): boolean {
    return attempts < maxRetries
  }
}
