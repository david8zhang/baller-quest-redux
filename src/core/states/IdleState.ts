import { OFFBALL_ANIMS, ONBALL_ANIMS, Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { State } from './StateMachine'

export class IdleState extends State {
  enter(currPlayer: CourtPlayer) {
    currPlayer.sprite.setVelocity(0, 0)
    currPlayer.sprite.setGravityY(0)
    const animToPlay = currPlayer.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle
    if (currPlayer.sprite.anims.currentAnim.key !== animToPlay) {
      const side = currPlayer.side === Side.CPU ? 'cpu' : 'player'
      currPlayer.sprite.anims.play(`${animToPlay}-${side}`)
    }
  }
}
