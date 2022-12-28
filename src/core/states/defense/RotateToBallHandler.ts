import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import { State } from '../StateMachine'

export class RotateToBallHandler extends State {
  execute(currPlayer: CourtPlayer, team: Team) {}
}
