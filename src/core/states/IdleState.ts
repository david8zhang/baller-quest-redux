import { OFFBALL_ANIMS, ONBALL_ANIMS } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { State } from './StateMachine'

export class IdleState extends State {
  enter(currPlayer: CourtPlayer) {
    currPlayer.stop()
    currPlayer.sprite.setVelocity(0, 0)
    currPlayer.sprite.setGravityY(0)
    currPlayer.sprite.anims.play(
      currPlayer.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle,
      true
    )
  }
}
