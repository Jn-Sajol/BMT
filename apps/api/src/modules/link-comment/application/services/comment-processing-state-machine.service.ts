import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type CommentProcessingJobState =
  | "Created"
  | "CollectionBatchConsumed"
  | "ProcessingQueueEnqueued"
  | "CommentsProcessed"
  | "LeadsScored"
  | "LeadQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class CommentProcessingStateMachine extends BaseStateMachine<CommentProcessingJobState> {}
