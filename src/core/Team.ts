import Game from '~/scenes/Game'
import { CourtPlayer } from './CourtPlayer'

export abstract class Team {
  public game: Game
  constructor(game: Game) {
    this.game = game
  }

  public abstract getCourtPlayers(): CourtPlayer[]
  public abstract getOtherTeamCourtPlayers(): CourtPlayer[]
  public abstract getOffensivePositions(): { [key: string]: { row: number; col: number } }
  public abstract getDefensivePositions(): { [key: string]: { row: number; col: number } }
  public abstract hasPossession(): boolean
  public abstract update(): void
  public abstract getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null

  positionPlayers() {
    const initialPositions = this.hasPossession()
      ? this.getOffensivePositions()
      : this.getDefensivePositions()
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
}
