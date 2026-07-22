import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type GroupAutoJoinJobState =
  | "Created"
  | "CandidateConsumed"
  | "PayloadValidated"
  | "PolicyValidated"
  | "HbfCalculated"
  | "Scheduled"
  | "Executing"
  | "Verified"
  | "Reported"
  | "Completed"
  | "Failed"

@Injectable()
export class GroupAutoJoinStateMachine extends BaseStateMachine<GroupAutoJoinJobState> {}
