import { BallState } from '~/core/Ball'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class HasPossession extends TreeNode {
  constructor(team: Team) {
    super('HasPossession', team)
  }

  public process(): Decision | States {
    const ball = Game.instance.ball
    if (
      ball.ballState === BallState.PASS ||
      ball.ballState === BallState.MADE_SHOT ||
      ball.ballState === BallState.MISSED_SHOT
    ) {
      const prevPlayerWithBall = ball.prevPlayerWithBall
      if (prevPlayerWithBall) {
        return prevPlayerWithBall.side === this.team.side ? Decision.PROCEED : Decision.STOP
      } else {
        return Decision.STOP
      }
    }
    return this.team.hasPossession() ? Decision.PROCEED : Decision.STOP
  }
}
