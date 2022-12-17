import { Ball } from '~/core/Ball'
import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { CourtPlayer, CourtPlayerState } from '~/core/CourtPlayer'
import { BlackboardKeys } from '../BlackboardKeys'

export class ShootBall extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('ShootBall', blackboard)
  }

  public process(): BehaviorStatus {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    const ball = this.blackboard.getData(BlackboardKeys.BALL) as Ball
    if (currPlayer.state === CourtPlayerState.SHOOTING) {
      return BehaviorStatus.RUNNING
    } else {
      currPlayer.shoot()
      return BehaviorStatus.SUCCESS
    }
  }
}
