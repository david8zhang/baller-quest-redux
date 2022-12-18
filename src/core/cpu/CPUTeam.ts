import Game from '~/scenes/Game'
import { Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { Team } from '../Team'
import { CPUConstants } from './CPUConstants'
import { CPUPlayerAI } from './CPUPlayerAI'

export class CPUTeam extends Team {
  private players: CPUPlayerAI[] = []

  constructor(game: Game) {
    super(game)
    this.setupPlayers()
    this.positionPlayers()
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
    return this.players.map((p) => p.courtPlayer)
  }

  public getOtherTeamCourtPlayers() {
    return this.game.player.getCourtPlayers()
  }

  public getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null {
    const otherTeamPlayers = this.getOtherTeamCourtPlayers()
    const playerToDefendId = CPUConstants.DEFENSIVE_ASSIGNMENTS[playerId]
    return otherTeamPlayers.find((player) => player.playerId === playerToDefendId) || null
  }

  public positionPlayers() {
    const hasPossession = this.game.ball.playerWithBall!.side === Side.CPU
    const initialPositions = hasPossession
      ? CPUConstants.OFFENSE_POSITIONS_CPU
      : CPUConstants.DEFENSE_POSITIONS_CPU
    const playerMapping = this.getCourtPlayers().reduce((acc, curr) => {
      acc[curr.playerId] = curr
      return acc
    }, {})
    Object.keys(initialPositions).forEach((key) => {
      const gridPos = initialPositions[key]
      const worldPos = this.game.court.getWorldPositionForCoordinates(gridPos.row, gridPos.col)
      const player = playerMapping[key] as CourtPlayer
      player.sprite.x = worldPos.x
      player.sprite.y = worldPos.y
    })
  }

  private setupPlayers() {
    Object.keys(CPUConstants.DEFENSE_POSITIONS_CPU).forEach((key) => {
      const player = new CourtPlayer(this.game, {
        position: {
          x: 0,
          y: 0,
        },
        side: Side.CPU,
        tint: 0xff0000,
        playerId: key,
      })
      this.players.push(new CPUPlayerAI(this.game, player, this))
      this.game.cpuCourtPlayers.add(player.sprite)
    })
  }

  update() {
    this.players.forEach((p) => {
      p.update()
    })
  }
}
