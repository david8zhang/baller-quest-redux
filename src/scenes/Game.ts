import Phaser from 'phaser'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { createPlayerAnims } from '~/core/CourtPlayerAnims'

export default class Game extends Phaser.Scene {
  constructor() {
    super('game')
  }

  create() {
    createPlayerAnims(this.anims)

    this.cameras.main.setBackgroundColor('#fff8dc')
    const courtPlayer = new CourtPlayer(this, {
      position: {
        x: WINDOW_WIDTH / 2,
        y: WINDOW_HEIGHT / 2,
      },
    })
  }
}
