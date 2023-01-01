import { CourtPlayer } from '~/core/CourtPlayer'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { OffensePlay } from './OffensePlay'

export class TakeShot extends OffensePlay {
  constructor(team: Team) {
    super(team)
  }

  public execute(): void {
    Game.instance.time.delayedCall(500, () => {
      const ballHandler = this.team.getCourtPlayers().find((player: CourtPlayer) => {
        return player.hasPossession
      })
      if (ballHandler) {
        ballHandler.setState(States.SHOOTING, () => {
          this.terminate()
        })
      }
    })
  }
}
