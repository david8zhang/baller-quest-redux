import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { getClosestPlayer } from '~/core/Constants'
import { CourtPlayer, CourtPlayerState } from '~/core/CourtPlayer'
import { BlackboardKeys } from '../BlackboardKeys'

export class PassBall extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('PassBall', blackboard)
  }

  public process(): BehaviorStatus {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    const teammates = this.blackboard.getData(
      BlackboardKeys.FRIENDLY_COURT_PLAYERS
    ) as CourtPlayer[]
    if (currPlayer.state === CourtPlayerState.PASSING) {
      return BehaviorStatus.RUNNING
    } else {
      const eligiblePassTargets = teammates.filter((p) => p.state !== CourtPlayerState.PASSING)
      if (eligiblePassTargets.length === 0) {
        return BehaviorStatus.FAILURE
      } else {
        const closestPlayer = getClosestPlayer(currPlayer, eligiblePassTargets)
        currPlayer.passBall(closestPlayer)
        return BehaviorStatus.SUCCESS
      }
    }
  }
}
