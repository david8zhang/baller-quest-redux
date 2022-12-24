import { BallState } from '~/core/Ball'
import { createArc, SORT_ORDER } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class LayupState extends State {
  enter(currPlayer: CourtPlayer, team: Team, onComplete?: Function) {
    currPlayer.sprite.body.checkCollision.none = true
    const hoop = Game.instance.hoop.standSprite
    const jumpDuration = 0.8
    currPlayer.sprite.anims.stop()
    currPlayer.sprite.setTexture('layup-gather-front')
    createArc(
      currPlayer.sprite,
      {
        x: hoop.x,
        y: hoop.y + hoop.displayHeight / 2 + 10,
      },
      jumpDuration
    )
    currPlayer.sprite.setDepth(SORT_ORDER.ui)
    Game.instance.time.delayedCall(975 * jumpDuration * 0.25, () => {
      currPlayer.sprite.setTexture('layup-arm-out-front')
    })

    Game.instance.time.delayedCall(975 * jumpDuration * 0.5, () => {
      currPlayer.sprite.setTexture('layup-flick-front')
      currPlayer.hasPossession = false
      Game.instance.ball.giveUpPossession()
      this.launchBallTowardsHoop(currPlayer)
    })
    Game.instance.time.delayedCall(975 * jumpDuration, () => {
      if (onComplete) {
        currPlayer.sprite.body.checkCollision.none = false
        onComplete(currPlayer)
      }
      currPlayer.setState(States.IDLE)
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
      0.7
    )
  }
}
