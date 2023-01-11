import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import { CPUTeam } from '../CPUTeam'
import { PlayTypes } from './PlayTypes'

export abstract class OffensePlay {
  protected team: Team
  public isRunning: boolean = false
  public playType: PlayTypes

  constructor(team: Team, playType: PlayTypes) {
    this.team = team
    this.playType = playType
  }

  public abstract execute(): void

  public reset() {
    this.isRunning = false
    const courtPlayers = this.team.getCourtPlayers()
    courtPlayers.forEach((p) => {
      p.setState(States.IDLE)
    })
    const cpuTeam = this.team as CPUTeam
    cpuTeam.selectNextPlay()
  }
}
