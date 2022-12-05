import Phaser from 'phaser'
import { createPlayerAnims } from '~/core/CourtPlayerAnims'
import { Player } from '~/core/Player'

export default class Game extends Phaser.Scene {
  public player!: Player

  constructor() {
    super('game')
  }

  create() {
    createPlayerAnims(this.anims)

    this.cameras.main.setBackgroundColor('#fff8dc')
    this.player = new Player(this)
  }

  update() {
    this.player.update()
  }
}
