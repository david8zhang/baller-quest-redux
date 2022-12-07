import Game from '~/scenes/Game'

export interface HoopConfig {
  position: {
    x: number
    y: number
  }
}

export class Hoop {
  private standSprite: Phaser.Physics.Arcade.Sprite
  private rimSprite: Phaser.Physics.Arcade.Sprite
  private game: Game
  constructor(game: Game, config: HoopConfig) {
    this.game = game
    const { position } = config
    this.standSprite = this.game.physics.add
      .sprite(position.x, position.y, 'hoop-stand')
      .setScale(3)
    this.rimSprite = this.game.physics.add.sprite(position.x, position.y, 'hoop-rim').setScale(3)
  }
}
