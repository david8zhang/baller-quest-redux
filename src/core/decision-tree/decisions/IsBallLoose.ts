import { BallState } from '~/core/Ball'
import { CourtPlayer } from '~/core/CourtPlayer'
import { States } from '~/core/states/States'
import Game from '~/scenes/Game'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class IsBallLoose extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('IsBallLoose', blackboard)
  }

  public process(): Decision | States {
    const ball = Game.instance.ball
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    if (currPlayer.getCurrState().key !== States.BLOCK_SHOT) {
      return ball.ballState === BallState.LOOSE || ball.ballState === BallState.BLOCKED
        ? Decision.PROCEED
        : Decision.STOP
    }
    return Decision.STOP
  }
}
