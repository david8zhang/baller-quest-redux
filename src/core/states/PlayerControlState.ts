import { CourtPlayer } from '../CourtPlayer'
import { State } from './StateMachine'

export class PlayerControlState extends State {
  enter(currPlayer: CourtPlayer) {
    currPlayer.sprite.setVelocity(0, 0)
    currPlayer.sprite.setGravity(0, 0)
  }
}
