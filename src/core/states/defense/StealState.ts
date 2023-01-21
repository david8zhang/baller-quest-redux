import { BallState } from '~/core/Ball'
import { createArc } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export interface StealStateConfig {
  onStealCallback: Function
}

export class StealState extends State {
  enter(currPlayer: CourtPlayer, team: Team, onStealFinished: Function) {
    const ball = team.game.ball
    const ballHandler = ball.playerWithBall
    if (ballHandler) {
      this.launchBallBackwardsAfterSteal(currPlayer, ballHandler, onStealFinished)
    }
  }

  launchBallBackwardsAfterSteal(
    currPlayer: CourtPlayer,
    ballHandler: CourtPlayer,
    onStealFinished: Function
  ) {
    ballHandler.setState(States.FUMBLE)
    Game.instance.cameras.main.shake(150, 0.005)
    const point = {
      x: ballHandler.sprite.x + 32,
      y: ballHandler.sprite.y + ballHandler.sprite.displayHeight,
    }
    const ball = Game.instance.ball
    ball.sprite.setDepth(ballHandler.sprite.depth + 1)
    ball.blockShotFloor.setPosition(
      point.x,
      Math.max(point.y, Game.instance.court.behindBackboardWallSprite.y + 25)
    )
    ball.blockShotFloorCollider.active = true
    ball.show()
    const stealDeflectDuration = 0.5
    ballHandler.losePossessionOfBall()
    ball.giveUpPossession()
    createArc(ball.sprite, point, stealDeflectDuration)
    Game.instance.time.delayedCall(stealDeflectDuration * 1000, () => {
      ball.ballState = BallState.STOLEN
      ballHandler.setState(States.IDLE)
      if (onStealFinished) {
        onStealFinished(currPlayer)
      }
    })
  }
}
