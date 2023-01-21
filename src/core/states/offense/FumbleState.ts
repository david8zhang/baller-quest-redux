import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import { State } from '../StateMachine'
import { States } from '../States'

export class FumbleState extends State {
  enter(currPlayer: CourtPlayer, team: Team, prevState: States) {
    currPlayer.sprite.setTint(0x0000ff)
  }

  exit(currPlayer: CourtPlayer) {
    currPlayer.sprite.clearTint()
  }
}
