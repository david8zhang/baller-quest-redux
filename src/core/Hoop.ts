import Game from '~/scenes/Game'
import { SORT_ORDER } from './Constants'

export interface HoopConfig {
  position: {
    x: number
    y: number
  }
}

export class Hoop {
  public standSprite: Phaser.Physics.Arcade.Sprite
  public rimSprite: Phaser.Physics.Arcade.Sprite
  private game: Game
  constructor(game: Game, config: HoopConfig) {
    this.game = game
    const { position } = config
    this.standSprite = this.game.physics.add
      .sprite(position.x, position.y, 'hoop-stand')
      .setScale(3)
      .setDepth(SORT_ORDER.stand)
      .setDebug(false, false, 0xffffff)
    this.rimSprite = this.game.physics.add
      .sprite(position.x, position.y, 'hoop-rim')
      .setScale(3)
      .setDepth(SORT_ORDER.rim)
      .setDebug(true, true, 0xff0000)
    this.rimSprite.body.setSize(10, 10)
    this.rimSprite.body.offset.y = 25

    this.game.physics.world.enable(this.rimSprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
  }
}
