import { Ball, BallState } from '~/core/Ball'
import { BehaviorStatus } from '../../behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '../../behavior-tree/BehaviorTreeNode'
import { Blackboard } from '../../behavior-tree/Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'

export class IsBallLoose extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('IsBallLoose', blackboard)
  }

  public process(): BehaviorStatus {
    const ball = this.blackboard.getData(BlackboardKeys.BALL) as Ball
    return ball.ballState === BallState.LOOSE ? BehaviorStatus.SUCCESS : BehaviorStatus.FAILURE
  }
}
