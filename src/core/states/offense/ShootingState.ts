import { BallState } from '~/core/Ball'
import { createArc } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class ShootingState extends State {
  enter(currPlayer: CourtPlayer, team: Team, callback: Function) {
    currPlayer.stop()
    currPlayer.sprite.body.checkCollision.none = true
    currPlayer.hasPossession = false
    currPlayer.sprite.setFlipX(false)
    const jumpTime = 0.7
    const initialX = currPlayer.sprite.x
    const initialY = currPlayer.sprite.y
    currPlayer.sprite.anims.stop()
    currPlayer.sprite.setTexture('shoot-jump')

    createArc(currPlayer.sprite, { x: initialX, y: initialY }, jumpTime)
    Game.instance.time.delayedCall(jumpTime * 975 * 0.45, () => {
      currPlayer.sprite.setTexture('shoot-flick')
      Game.instance.ball.giveUpPossession()
      this.launchBallTowardsHoop(currPlayer)
    })
    Game.instance.time.delayedCall(jumpTime * 975, () => {
      currPlayer.sprite.body.checkCollision.none = false
      currPlayer.setState(States.IDLE)
      if (callback) {
        callback(currPlayer)
      }
    })
  }

  launchBallTowardsHoop(currPlayer: CourtPlayer) {
    const ball = Game.instance.ball
    ball.show()
    Game.instance.ball.setPosition(currPlayer.sprite.x + 5, currPlayer.sprite.y - 28)

    const isMiss = Phaser.Math.Between(0, 100) < -1
    let posToLandX = Game.instance.hoop.rimSprite.x
    if (isMiss) {
      ball.ballState = BallState.MISSED_SHOT
      const missOffset = Phaser.Math.Between(0, 1) ? -10 : 10
      posToLandX = Game.instance.hoop.rimSprite.x + missOffset
    } else {
      ball.ballState = BallState.MADE_SHOT
    }
    createArc(
      ball.sprite,
      {
        x: posToLandX,
        y: Game.instance.hoop.rimSprite.y - 20,
      },
      1.5
    )
  }
}
