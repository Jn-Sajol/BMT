import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type MessengerAutoReplyJobState =
  | "Created"
  | "ApprovedConversationReceived"
  | "PolicyValidated"
  | "ReplyModeSelected"
  | "ReplySuggestionGenerated"
  | "FallbackEvaluated"
  | "DelayScheduled"
  | "ReplyQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class MessengerAutoReplyStateMachine extends BaseStateMachine<MessengerAutoReplyJobState> {}
