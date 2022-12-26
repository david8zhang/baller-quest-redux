import { States } from '~/core/states/States'
import { Team } from '~/core/Team'

export abstract class OffensePlay {
  protected team: Team
  public isRunning: boolean = false

  constructor(team: Team) {
    this.team = team
  }

  public abstract execute(): void

  public terminate() {
    const courtPlayers = this.team.getCourtPlayers()
    courtPlayers.forEach((p) => {
      p.setState(States.IDLE)
    })
  }
}
