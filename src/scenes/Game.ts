import Phaser from 'phaser'
import { Ball } from '~/core/Ball'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { Court } from '~/core/Court'
import { createPlayerAnims } from '~/core/CourtPlayerAnims'
import { Cursor } from '~/core/Cursor'
import { Hoop } from '~/core/Hoop'
import { Player } from '~/core/Player'

export default class Game extends Phaser.Scene {
  public player!: Player
  public hoop!: Hoop
  public ball!: Ball
  public court!: Court
  public cursor!: Cursor

  public playerCourtPlayers!: Phaser.GameObjects.Group

  constructor() {
    super('game')
  }

  create() {
    createPlayerAnims(this.anims)
    this.playerCourtPlayers = this.add.group()
    this.court = new Court(this)
    this.hoop = new Hoop(this, {
      position: {
        x: WINDOW_WIDTH / 2,
        y: WINDOW_HEIGHT / 2 - 128,
      },
    })
    this.ball = new Ball(this, {
      position: { x: 0, y: 0 },
    })
    this.cameras.main.setBackgroundColor('#fff8dc')
    this.player = new Player(this)
  }

  update() {
    this.player.update()
    this.ball.update()
  }
}
