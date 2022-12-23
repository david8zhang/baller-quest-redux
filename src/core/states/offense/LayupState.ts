import { BallState } from '~/core/Ball'
import { createArc } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class LayupState extends State {
  enter(currPlayer: CourtPlayer, team: Team, onComplete?: Function) {
    currPlayer.sprite.body.checkCollision.none = true
    const hoop = Game.instance.hoop.standSprite
    const jumpDuration = 1
    createArc(
      currPlayer.sprite,
      {
        x: hoop.x,
        y: hoop.y + hoop.displayHeight / 2 + 10,
      },
      jumpDuration
    )
    Game.instance.time.delayedCall(975 * jumpDuration * 0.5, () => {
      currPlayer.hasPossession = false
      Game.instance.ball.giveUpPossession()
      this.launchBallTowardsHoop(currPlayer)
    })
    Game.instance.time.delayedCall(975 * jumpDuration, () => {
      if (onComplete) {
        onComplete(currPlayer)
      }
      currPlayer.setState(States.IDLE)
    })
  }

  launchBallTowardsHoop(currPlayer: CourtPlayer) {
    const ball = Game.instance.ball
    ball.show()
    Game.instance.ball.setPosition(currPlayer.sprite.x + 5, currPlayer.sprite.y - 28)

    const isMiss = Phaser.Math.Between(0, 100) > 0
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
      0.6
    )
  }
}
