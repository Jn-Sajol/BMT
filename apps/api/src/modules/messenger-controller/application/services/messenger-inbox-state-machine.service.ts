import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type MessengerInboxJobState =
  | "Created"
  | "IncomingConversationReceived"
  | "Normalized"
  | "Deduplicated"
  | "Classified"
  | "InboxQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class MessengerInboxStateMachine extends BaseStateMachine<MessengerInboxJobState> {}
