import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type CommentModerationJobState =
  | "Created"
  | "IncomingCommentReceived"
  | "LinkDetected"
  | "ModerationEvaluated"
  | "DeleteQueueEnqueued"
  | "Deleted"
  | "VerificationQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class CommentModerationStateMachine extends BaseStateMachine<CommentModerationJobState> {}
