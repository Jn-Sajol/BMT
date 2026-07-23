import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type MessengerManualReplyJobState =
  | "Created"
  | "IncomingInboxReceived"
  | "SuggestionEngineProcessed"
  | "ManualApprovalEnqueued"
  | "ReplyQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class MessengerManualReplyStateMachine extends BaseStateMachine<MessengerManualReplyJobState> {}
