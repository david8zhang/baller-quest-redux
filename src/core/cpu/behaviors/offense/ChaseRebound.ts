import { Ball } from '~/core/Ball'
import { CourtPlayer } from '~/core/CourtPlayer'
import { BehaviorStatus } from '../../behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '../../behavior-tree/BehaviorTreeNode'
import { Blackboard } from '../../behavior-tree/Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'

export class ChaseRebound extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('ChaseRebound', blackboard)
  }

  public process(): BehaviorStatus {
    const ball = this.blackboard.getData(BlackboardKeys.BALL) as Ball
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    if (!ball.playerWithBall) {
      currPlayer.moveTowards({
        x: ball.sprite.x,
        y: ball.sprite.y,
      })
      return BehaviorStatus.SUCCESS
    } else {
      return BehaviorStatus.FAILURE
    }
  }
}
