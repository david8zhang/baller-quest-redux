import Game from '~/scenes/Game'
import { getClosestPlayer, Side } from './Constants'
import { CourtPlayer } from './CourtPlayer'
import { DefendManState } from './states/defense/DefendManState'
import { States } from './states/States'

export abstract class Team {
  public game: Game
  public side: Side
  public players: CourtPlayer[] = []

  constructor(game: Game, side: Side) {
    this.game = game
    this.side = side
  }

  public abstract getCourtPlayers(): CourtPlayer[]
  public abstract getOtherTeamCourtPlayers(): CourtPlayer[]
  public abstract getOtherTeam(): Team
  public abstract getPlayerToReceiveBallOnNewPossession(): CourtPlayer

  public abstract getOffensivePositions(): { [key: string]: { row: number; col: number } }
  public abstract getDefensivePositions(): { [key: string]: { row: number; col: number } }
  public abstract shouldDunk(): boolean
  public abstract update(): void

  public abstract getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null

  public handleNewPossession() {
    this.players.forEach((p) => {
      p.hasPossession = false
    })
    const playerToReceiveBall = this.getPlayerToReceiveBallOnNewPossession()
    playerToReceiveBall.getPossessionOfBall()
  }

  public getDefenderForPlayer(player: CourtPlayer): CourtPlayer | null {
    const enemyPlayers = this.getOtherTeamCourtPlayers()
    let defender: CourtPlayer | null = null
    enemyPlayers.forEach((enemyPlayer: CourtPlayer) => {
      const state = enemyPlayer.getCurrState()
      if (state.key === States.DEFEND_MAN) {
        const defendManState = state.data as DefendManState
        if (defendManState.manToDefend && defendManState.manToDefend.playerId === player.playerId) {
          defender = enemyPlayer
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
