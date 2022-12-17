import { Ball } from '~/core/Ball'
import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { Side } from '~/core/Constants'
import { BlackboardKeys } from '../BlackboardKeys'

export class TeamHasPossession extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('TeamHasPossession', blackboard)
  }

  public process(): BehaviorStatus {
    const ball = this.blackboard.getData(BlackboardKeys.BALL) as Ball
    if (ball.playerWithBall) {
      return ball.playerWithBall.side === Side.PLAYER
        ? BehaviorStatus.SUCCESS
        : BehaviorStatus.FAILURE
    }
    return BehaviorStatus.FAILURE
  }
}
