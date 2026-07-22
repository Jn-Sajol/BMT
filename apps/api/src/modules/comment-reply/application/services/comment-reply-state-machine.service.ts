import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type CommentReplyJobState =
  | "Created"
  | "IncomingCommentReceived"
  | "InboxQueueEnqueued"
  | "ReplySuggested"
  | "ManualApprovalEnqueued"
  | "ReplyQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class CommentReplyStateMachine extends BaseStateMachine<CommentReplyJobState> {}
