import { BallState } from '~/core/Ball'
import { createArc, SORT_ORDER } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class DunkState extends State {
  enter(currPlayer: CourtPlayer, team: Team, onComplete?: Function) {
    const hoop = Game.instance.hoop.rimSprite
    const jumpDuration = 0.75
    createArc(
      currPlayer.sprite,
      {
        x: hoop.x,
        y: hoop.y,
      },
      jumpDuration
    )
    currPlayer.sprite.setDepth(SORT_ORDER.ui)
    currPlayer.sprite.body.checkCollision.none = true
    Game.instance.time.delayedCall(975 * jumpDuration, () => {
      Game.instance.cameras.main.shake(150, 0.005)
      currPlayer.stop()
      currPlayer.sprite.setGravityY(0)
      currPlayer.hasPossession = false
      Game.instance.ball.giveUpPossession()
      Game.instance.ball.ballState = BallState.DUNK

      Game.instance.time.delayedCall(100, () => {
        currPlayer.sprite.setGravityY(980)
        Game.instance.time.delayedCall(350, () => {
          if (onComplete) {
            currPlayer.sprite.body.checkCollision.none = false
            onComplete(currPlayer)
          }
          currPlayer.setState(States.IDLE)
        })
      })
    })
  }
}
