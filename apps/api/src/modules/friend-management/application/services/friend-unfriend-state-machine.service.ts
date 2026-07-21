import { Injectable } from "@nestjs/common"
import { BaseStateMachine } from "../../../automation-core/domain/base-state-machine"

export type UnfriendJobState = "Created" | "Prepared" | "Waiting" | "Running" | "Verifying" | "Completed" | "Failed"

@Injectable()
export class FriendUnfriendStateMachine extends BaseStateMachine<UnfriendJobState> {}
