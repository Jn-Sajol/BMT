import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type GroupHunterJobState =
  | "Created"
  | "DiscoveryReceived"
  | "Normalized"
  | "Deduplicated"
  | "Filtered"
  | "Scored"
  | "CandidateQueuePrepared"
  | "Exported"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class GroupHunterStateMachine extends BaseStateMachine<GroupHunterJobState> {}
