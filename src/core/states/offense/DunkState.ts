import { BallState } from '~/core/Ball'
import { createArc, Side, SORT_ORDER } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class DunkState extends State {
  enter(currPlayer: CourtPlayer, team: Team, onComplete?: Function) {
    const hoop = Game.instance.hoop.rimSprite
    const ball = Game.instance.ball
    const suffix = currPlayer.side === Side.CPU ? 'cpu' : 'player'
    currPlayer.sprite.anims.stop()
    currPlayer.sprite.setName('shooting')
    currPlayer.sprite.setTexture(`dunk-arm-out-front-${suffix}`)
    const jumpDuration = 0.75
    createArc(
      currPlayer.sprite,
      {
        x: hoop.x,
        y: hoop.y + 12,
      },
      jumpDuration
    )
    currPlayer.sprite.setDepth(SORT_ORDER.ui)
    currPlayer.sprite.body.checkCollision.none = true

    Game.instance.time.delayedCall(975 * jumpDuration * 0.5, () => {
      currPlayer.sprite.setTexture(`dunk-wind-up-front-${suffix}`)
    })

    Game.instance.time.delayedCall(975 * jumpDuration, () => {
      Game.instance.cameras.main.shake(150, 0.005)
      currPlayer.sprite.setVelocity(0, 0)
      currPlayer.sprite.setGravityY(0)
      currPlayer.hasPossession = false
      ball.giveUpPossession()
      ball.setPosition(hoop.x, hoop.y)
      ball.sprite.setVelocityX(0)
      ball.ballState = BallState.DUNK
      currPlayer.sprite.setTexture(`dunk-finish-front-${suffix}`)

      Game.instance.time.delayedCall(300, () => {
        currPlayer.sprite.setGravityY(980)
        Game.instance.time.delayedCall(300, () => {
          currPlayer.sprite.body.checkCollision.none = false
          if (onComplete) {
            onComplete(currPlayer)
          } else {
            currPlayer.setState(States.IDLE)
          }
        })
      })
    })
  }

  exit(currPlayer: CourtPlayer) {
    currPlayer.sprite.setName('')
    currPlayer.shotReleased = false
  }
}
