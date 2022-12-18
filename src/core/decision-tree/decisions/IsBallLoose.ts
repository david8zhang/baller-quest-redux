import { BallState } from '~/core/Ball'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class IsBallLoose extends TreeNode {
  constructor(team: Team) {
    super('IsBallLoose', team)
  }

  public process(): Decision | States {
    const ball = Game.instance.ball
    return ball.ballState === BallState.LOOSE ? Decision.PROCEED : Decision.STOP
  }
}
