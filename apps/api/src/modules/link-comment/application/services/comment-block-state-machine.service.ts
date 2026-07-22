import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type CommentBlockJobState =
  | "Created"
  | "TargetRegistered"
  | "PayloadValidated"
  | "PolicyValidated"
  | "HbfCalculated"
  | "Scheduled"
  | "ParsingQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class CommentBlockStateMachine extends BaseStateMachine<CommentBlockJobState> {}
