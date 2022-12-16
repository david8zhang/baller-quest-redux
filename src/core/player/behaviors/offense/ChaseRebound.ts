import { Ball, BallState } from '~/core/Ball'
import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { CourtPlayer } from '~/core/CourtPlayer'
import Game from '~/scenes/Game'
import { BlackboardKeys } from '../BlackboardKeys'

export class ChaseRebound extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('ChaseRebound', blackboard)
  }

  public process(): BehaviorStatus {
    const ball = this.blackboard.getData(BlackboardKeys.BALL) as Ball
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    if (ball.ballState === BallState.LOOSE) {
      currPlayer.moveTowards({
        x: ball.sprite.x,
        y: ball.sprite.y,
      })
      return BehaviorStatus.RUNNING
    } else {
      if (ball.playerWithBall === currPlayer) {
        Game.instance.player.setSelectedCourtPlayer(currPlayer)
      }
      return BehaviorStatus.SUCCESS
    }
  }
}
