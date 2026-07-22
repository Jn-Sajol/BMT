import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type AutoReplyJobState =
  | "Created"
  | "ApprovedInboxReceived"
  | "PolicyValidated"
  | "SavedReplySelected"
  | "VariationGenerated"
  | "DelayScheduled"
  | "ReplyQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class AutoReplyStateMachine extends BaseStateMachine<AutoReplyJobState> {}
