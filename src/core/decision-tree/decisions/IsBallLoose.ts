import { BallState } from '~/core/Ball'
import { States } from '~/core/states/States'
import Game from '~/scenes/Game'
import { Blackboard } from '../Blackboard'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class IsBallLoose extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('IsBallLoose', blackboard)
  }

  public process(): Decision | States {
    const ball = Game.instance.ball
    return ball.ballState === BallState.LOOSE || ball.ballState === BallState.BLOCKED
      ? Decision.PROCEED
      : Decision.STOP
  }
}
