import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type MessengerGroupJobState =
  | "Created"
  | "IncomingGroupReceived"
  | "GroupNormalized"
  | "GroupDeduplicated"
  | "GroupClassified"
  | "CampaignPreparationEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class MessengerGroupStateMachine extends BaseStateMachine<MessengerGroupJobState> {}
