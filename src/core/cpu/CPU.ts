import Game from '~/scenes/Game'
import { Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { DEFENSE_POSITIONS_CPU, OFFENSE_POSITIONS_CPU } from './CPUConstants'
import { CPUPlayerAI } from './CPUPlayerAI'

export class CPU {
  private game: Game
  private players: CPUPlayerAI[] = []

  constructor(game: Game) {
    this.game = game
    this.setupPlayers()
    this.positionPlayers()
  }

  getCourtPlayers() {
    return this.players.map((p) => p.courtPlayer)
  }

  getOtherTeamCourtPlayers() {
    return this.game.player.getCourtPlayers()
  }

  positionPlayers() {
    const hasPossession = this.game.ball.playerWithBall!.side === Side.CPU
    const initialPositions = hasPossession ? OFFENSE_POSITIONS_CPU : DEFENSE_POSITIONS_CPU
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

  setupPlayers() {
    Object.keys(DEFENSE_POSITIONS_CPU).forEach((key) => {
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
      p.process()
    })
  }
}
