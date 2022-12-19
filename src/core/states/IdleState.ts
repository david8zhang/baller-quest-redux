import { CourtPlayer } from '../CourtPlayer'
import { CourtPlayerAI } from '../CourtPlayerAI'
import { State } from './StateMachine'

export class IdleState extends State {
  enter(currPlayer: CourtPlayerAI) {
    currPlayer.courtPlayer.stop()
  }
}
