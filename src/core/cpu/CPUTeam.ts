import Game from '~/scenes/Game'
import { Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { Team } from '../Team'
import { CPUConstants } from './CPUConstants'
import { CPUCourtPlayer } from './CPUCourtPlayer'

export class CPUTeam extends Team {
  public players: CPUCourtPlayer[] = []

  constructor(game: Game) {
    super(game, Side.CPU)
    this.setupPlayers()
    super.positionPlayers()
  }

  public getOffensivePositions(): { [key: string]: { row: number; col: number } } {
    return CPUConstants.OFFENSE_POSITIONS_CPU
  }

  public getDefensivePositions(): { [key: string]: { row: number; col: number } } {
    return CPUConstants.DEFENSE_POSITIONS_CPU
  }

  public hasPossession(): boolean {
    return this.game.ball.playerWithBall !== null && this.game.ball.playerWithBall.side === Side.CPU
  }

  public getCourtPlayers() {
    return this.players
  }

  public getOtherTeamCourtPlayers() {
    return this.game.player.getCourtPlayers()
  }
  public getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null {
    const otherTeamPlayers = this.getOtherTeamCourtPlayers()
    const playerToDefendId = CPUConstants.DEFENSIVE_ASSIGNMENTS[playerId]
    return otherTeamPlayers.find((player) => player.playerId === playerToDefendId) || null
  }

  public getOtherTeam() {
    return this.game.player
  }

  private setupPlayers() {
    Object.keys(CPUConstants.DEFENSE_POSITIONS_CPU).forEach((key) => {
      const player = new CPUCourtPlayer(this.game, {
        position: {
          x: 0,
          y: 0,
        },
        side: Side.CPU,
        tint: 0xff0000,
        playerId: key,
        team: this,
      })
      this.players.push(player)
      this.game.cpuCourtPlayers.add(player.sprite)
    })
  }

  update() {
    this.players.forEach((p) => {
      p.update()
    })
  }
}
