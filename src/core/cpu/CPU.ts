import Game from '~/scenes/Game'
import { Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { INITIAL_PLAYER_POSITIONS_CPU } from './CPUConstants'
import { CPUPlayerAI } from './CPUPlayerAI'

export class CPU {
  private game: Game
  private players: CPUPlayerAI[] = []

  constructor(game: Game) {
    this.game = game
    this.setupPlayers()
  }

  getCourtPlayers() {
    return this.players.map((p) => p.courtPlayer)
  }

  getOtherTeamCourtPlayers() {
    return this.game.player.getCourtPlayers()
  }

  setupPlayers() {
    Object.keys(INITIAL_PLAYER_POSITIONS_CPU).forEach((key) => {
      const gridPos = INITIAL_PLAYER_POSITIONS_CPU[key]
      const worldPos = this.game.court.getWorldPositionForCoordinates(gridPos.row, gridPos.col)
      const player = new CourtPlayer(this.game, {
        position: {
          x: worldPos.x,
          y: worldPos.y,
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
