import Game from '~/scenes/Game'
import { CourtPlayer } from './CourtPlayer'

export interface CursorConfig {
  color?: number
  alpha?: number
  position: { x: number; y: number }
}

export class Cursor {
  private game: Game
  public selectedCourtPlayer?: CourtPlayer
  public highlight: Phaser.Physics.Arcade.Sprite

  constructor(config: CursorConfig, game: Game) {
    this.game = game
    const { x, y } = config.position
    this.highlight = this.game.physics.add
      .sprite(x, y, 'highlight-cursor')
      .setVisible(false)
      .setScale(3)
      .setAlpha(config.alpha ? config.alpha : 1)
    if (config.color) {
      this.highlight.setTintFill(config.color)
    }
  }

  highlightCourtPlayer(courtPlayer: CourtPlayer) {
    const courtPlayerSprite = courtPlayer.sprite
    this.highlight.setVisible(true)
    this.highlight.setPosition(
      courtPlayerSprite.x,
      courtPlayerSprite.y + courtPlayerSprite.displayHeight / 2
    )
  }

  setVisible(isVisible: boolean) {
    this.highlight.setVisible(isVisible)
  }

  selectCourtPlayer(courtPlayer: CourtPlayer) {
    this.selectedCourtPlayer = courtPlayer
    this.highlightCourtPlayer(courtPlayer)
  }

  follow() {
    if (this.selectedCourtPlayer) {
      const selectedCourtPlayerVelocity = this.selectedCourtPlayer.sprite.body.velocity
      this.highlight.setVelocity(selectedCourtPlayerVelocity.x, selectedCourtPlayerVelocity.y)
    }
  }
}
