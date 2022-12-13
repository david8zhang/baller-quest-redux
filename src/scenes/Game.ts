import Phaser from 'phaser'
import { Ball } from '~/core/Ball'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { Court } from '~/core/Court'
import { CourtPlayer } from '~/core/CourtPlayer'
import { createPlayerAnims } from '~/core/CourtPlayerAnims'
import { CPU } from '~/core/cpu/CPU'
import { Cursor } from '~/core/Cursor'
import { Hoop } from '~/core/Hoop'
import { Player } from '~/core/Player'

export default class Game extends Phaser.Scene {
  public player!: Player
  public cpu!: CPU
  public hoop!: Hoop
  public ball!: Ball
  public court!: Court
  public cursor!: Cursor

  public playerCourtPlayers!: Phaser.GameObjects.Group
  public cpuCourtPlayers!: Phaser.GameObjects.Group
  private static _instance: Game

  constructor() {
    super('game')
    Game._instance = this
  }

  public static get instance() {
    return Game._instance
  }

  create() {
    createPlayerAnims(this.anims)
    this.playerCourtPlayers = this.add.group()
    this.cpuCourtPlayers = this.add.group()
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
    this.cpu = new CPU(this)
    this.setupColliders()
  }

  setupColliders() {
    this.physics.world.checkCollision.up = false
    const playerBallCollisionHandler = (obj1, obj2) => {
      const player = obj2.getData('ref') as CourtPlayer
      player.handleBallCollision()
      this.ball.handlePlayerCollision()
    }
    this.physics.add.overlap(this.ball.sprite, this.playerCourtPlayers, playerBallCollisionHandler)
    this.physics.add.overlap(this.ball.sprite, this.cpuCourtPlayers, playerBallCollisionHandler)
    this.physics.add.collider(this.playerCourtPlayers, this.cpuCourtPlayers)
  }

  update() {
    this.ball.update()
    this.player.update()
    this.cpu.update()
  }
}
