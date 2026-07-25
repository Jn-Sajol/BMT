import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type MessengerGroupMessagingJobState =
  | "Created"
  | "PreparedCampaignReceived"
  | "PolicyValidated"
  | "TemplateSelected"
  | "VariationGenerated"
  | "DelayScheduled"
  | "MessageQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class MessengerGroupMessagingStateMachine extends BaseStateMachine<MessengerGroupMessagingJobState> {}
