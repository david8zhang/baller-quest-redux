import { CourtPlayer } from '../CourtPlayer'
import { State } from './StateMachine'

export class IdleState extends State {
  enter(currPlayer: CourtPlayer) {
    currPlayer.stop()
  }
}
