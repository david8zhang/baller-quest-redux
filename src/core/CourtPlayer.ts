import Game from '~/scenes/Game'

export interface CourtPlayerConfig {
  position: {
    x: number
    y: number
  }
}

export class CourtPlayer {
  private game: Game
  private sprite: Phaser.GameObjects.Sprite

  constructor(game: Game, config: CourtPlayerConfig) {
    this.game = game
    const { position } = config
    this.sprite = this.game.add.sprite(position.x, position.y, 'idle').setScale(2)
    this.sprite.anims.play('idle')
  }
}
