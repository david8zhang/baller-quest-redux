import Game from '~/scenes/Game'
import { BallState } from './Ball'
import { getClosestPlayer, Side } from './Constants'
import { CourtPlayer } from './CourtPlayer'
import { DefendManState } from './states/defense/DefendManState'
import { States } from './states/States'

export abstract class Team {
  public game: Game
  public side: Side
  public players: CourtPlayer[] = []
  public defensiveAssignmentMapping: any = {}

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
      p.setState(States.IDLE)
    })
    const playerToReceiveBall = this.getPlayerToReceiveBallOnNewPossession()
    Game.instance.ball.prevPlayerWithBall = null
    playerToReceiveBall.getPossessionOfBall(BallState.LOOSE)
  }

  public abstract handleNewDefenseSetup(): void

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
    const ball = this.game.ball
    if (ball.ballState === BallState.PASS || ball.isBallInFlight()) {
      return ball.prevPlayerWithBall !== null && ball.prevPlayerWithBall.side === this.side
    }
    return ball.playerWithBall !== null && ball.playerWithBall.side === this.side
  }

  public abstract handleOffensiveRebound(side: Side, shouldResetClock?: boolean): void

  updateDefensiveAssignmentMapping(defenderId: string, manToDefendId: string) {
    this.defensiveAssignmentMapping[defenderId] = manToDefendId
  }

  getPlayerById(playerId: string) {
    return this.players.find((player) => {
      return player.playerId === playerId
    })
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
