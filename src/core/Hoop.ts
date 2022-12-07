import Game from '~/scenes/Game'

export interface HoopConfig {
  position: {
    x: number
    y: number
  }
}

export class Hoop {
  private sprite: Phaser.Physics.Arcade.Sprite
  private game: Game
  constructor(game: Game, config: HoopConfig) {
    this.game = game
    const { position } = config
    this.sprite = this.game.physics.add.sprite(position.x, position.y, 'hoop').setScale(2)
  }
}
