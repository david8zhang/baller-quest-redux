import Game from '~/scenes/Game'
import { getClosestPlayer, Side } from './Constants'
import { CourtPlayer } from './CourtPlayer'
import { CourtPlayerAI } from './CourtPlayerAI'
import { DefendManState } from './states/defense/DefendManState'
import { States } from './states/States'

export abstract class Team {
  public game: Game
  public side: Side
  public playerAI: CourtPlayerAI[] = []

  constructor(game: Game, side: Side) {
    this.game = game
    this.side = side
  }

  public abstract getCourtPlayers(): CourtPlayer[]
  public abstract getOtherTeamCourtPlayers(): CourtPlayer[]
  public abstract getOtherTeam(): Team
  public abstract getEnemyAIs(): CourtPlayerAI[]

  public abstract getOffensivePositions(): { [key: string]: { row: number; col: number } }
  public abstract getDefensivePositions(): { [key: string]: { row: number; col: number } }
  public abstract update(): void

  public abstract getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null

  public getDefenderForPlayer(player: CourtPlayer): CourtPlayer | null {
    const enemyPlayerAIs = this.getEnemyAIs()
    let defender: CourtPlayer | null = null
    enemyPlayerAIs.forEach((enemyAI: CourtPlayerAI) => {
      const state = enemyAI.getCurrState()
      if (state.key === States.DEFEND_MAN) {
        const defendManState = state.data as DefendManState
        if (defendManState.manToDefend && defendManState.manToDefend.playerId === player.playerId) {
          defender = enemyAI.courtPlayer
        }
      }
    })
    if (defender === null) {
      const closestDefender = getClosestPlayer(player, this.getOtherTeamCourtPlayers())
      return closestDefender
    }
    return defender
  }

  hasPossession(): boolean {
    const ball = Game.instance.ball
    if (ball.playerWithBall) {
      return ball.playerWithBall.side === this.side
    }
    return false
  }

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
