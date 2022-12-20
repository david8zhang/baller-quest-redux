import { createArc } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class ContestShotState extends State {
  execute(currPlayer: CourtPlayer) {
    currPlayer.stop()
    const jumpTime = 0.7
    const initialX = currPlayer.sprite.x
    const initialY = currPlayer.sprite.y
    createArc(
      currPlayer.sprite,
      {
        x: initialX,
        y: initialY,
      },
      jumpTime
    )
    Game.instance.time.delayedCall(jumpTime * 975, () => {
      currPlayer.sprite.body.checkCollision.none = false
      currPlayer.setState(States.IDLE)
    })
  }
}
