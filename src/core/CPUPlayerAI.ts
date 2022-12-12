import Game from '~/scenes/Game'
import { CourtPlayer } from './CourtPlayer'

export class CPUPlayerAI {
  private game: Game
  private courtPlayer: CourtPlayer

  constructor(game: Game, courtPlayer: CourtPlayer) {
    this.game = game
    this.courtPlayer = courtPlayer
  }
}
