import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type CommentCollectionJobState =
  | "Created"
  | "ParsedTargetConsumed"
  | "PayloadValidated"
  | "PolicyValidated"
  | "HbfCalculated"
  | "Scheduled"
  | "CollectionQueueEnqueued"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class CommentCollectionStateMachine extends BaseStateMachine<CommentCollectionJobState> {}
