import { CourtPlayer, CourtPlayerState } from '~/core/CourtPlayer'
import { BehaviorStatus } from '../../behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '../../behavior-tree/BehaviorTreeNode'
import { Blackboard } from '../../behavior-tree/Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'

export class ContestPlayerShot extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('ContestPlayerShot', blackboard)
  }

  public process(): BehaviorStatus {
    const defensiveAssignment = this.blackboard.getData(
      BlackboardKeys.CURR_DEFENSIVE_ASSIGNMENT
    ) as CourtPlayer
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    if (
      defensiveAssignment.state !== CourtPlayerState.SHOOTING ||
      currPlayer.state === CourtPlayerState.CONTESTING
    ) {
      return BehaviorStatus.FAILURE
    } else {
      currPlayer.contestShot()
      return BehaviorStatus.SUCCESS
    }
  }
}
