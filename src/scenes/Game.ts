import Phaser from 'phaser'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { createPlayerAnims } from '~/core/CourtPlayerAnims'
import { Hoop } from '~/core/Hoop'
import { Player } from '~/core/Player'

export default class Game extends Phaser.Scene {
  public player!: Player
  public hoop!: Hoop

  constructor() {
    super('game')
  }

  create() {
    createPlayerAnims(this.anims)

    this.cameras.main.setBackgroundColor('#fff8dc')
    this.hoop = new Hoop(this, {
      position: {
        x: WINDOW_WIDTH / 2,
        y: WINDOW_HEIGHT / 2 - 64,
      },
    })
    this.player = new Player(this)
  }

  update() {
    this.player.update()
  }
}
