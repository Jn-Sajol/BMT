import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type GroupHunterJobState = "Created" | "KeywordsNormalized" | "DuplicatesFiltered" | "Classified" | "ScoredAndRanked" | "CandidateQueueGenerated" | "Completed" | "Failed"

@Injectable()
export class GroupHunterStateMachine extends BaseStateMachine<GroupHunterJobState> {}
