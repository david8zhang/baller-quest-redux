import { BallState } from '~/core/Ball'
import { createArc, STEAL_LIKELIHOOD_ATTRIBUTE_MAPPING } from '~/core/Constants'
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

    currPlayer.sprite.anims.stop()
    currPlayer.setVelocity(0, 0)

    const stealSuccessPct =
      STEAL_LIKELIHOOD_ATTRIBUTE_MAPPING[currPlayer.attributes.steal.toString()]
    const didStealSucceed = Phaser.Math.Between(0, 100) <= stealSuccessPct
    console.log('Did Steal Succeed: ', didStealSucceed)

    if (ballHandler) {
      if (didStealSucceed) {
        this.launchBallBackwardsAfterSteal(currPlayer, ballHandler)
      }
      Game.instance.time.delayedCall(250, () => {
        if (onStealFinished) {
          onStealFinished(currPlayer)
        }
      })
    }
  }

  launchBallBackwardsAfterSteal(currPlayer: CourtPlayer, ballHandler: CourtPlayer) {
    ballHandler.setState(States.FUMBLE)
    Game.instance.cameras.main.shake(150, 0.005)
    const xDiff = Phaser.Math.Between(0, 1) == 0 ? 32 : -32
    const point = {
      x: ballHandler.sprite.x + xDiff,
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
    })
  }
}
