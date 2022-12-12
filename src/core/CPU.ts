import Game from '~/scenes/Game'
import { INITIAL_PLAYER_POSITIONS_CPU, Side } from './Constants'
import { CourtPlayer } from './CourtPlayer'

export class CPU {
  private game: Game
  private players: CourtPlayer[] = []

  constructor(game: Game) {
    this.game = game
    this.setupPlayers()
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
      })
      this.players.push(player)
      this.game.cpuCourtPlayers.add(player.sprite)
    })
  }
}
