import Phaser from 'phaser'
import { Ball } from '~/core/Ball'
import { Side, SORT_ORDER, WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { Court } from '~/core/Court'
import { CourtPlayer } from '~/core/CourtPlayer'
import { createPlayerAnims } from '~/core/CourtPlayerAnims'
import { CPUTeam } from '~/core/cpu/CPUTeam'
import { Cursor } from '~/core/Cursor'
import { Hoop } from '~/core/Hoop'
import { PlayerTeam } from '~/core/player/PlayerTeam'

export default class Game extends Phaser.Scene {
  public player!: PlayerTeam
  public cpu!: CPUTeam
  public hoop!: Hoop
  public ball!: Ball
  public court!: Court
  public cursor!: Cursor
  private changingPossessionText!: Phaser.GameObjects.Text
  private changingPossessionOverlay!: Phaser.GameObjects.Rectangle
  public isChangingPossession: boolean = false
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
    this.player = new PlayerTeam(this)
    this.cpu = new CPUTeam(this)
    this.setupColliders()
    this.setupUI()
  }

  setupUI() {
    this.changingPossessionOverlay = this.add
      .rectangle(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2, WINDOW_WIDTH, WINDOW_HEIGHT, 0x000000, 0.5)
      .setDepth(SORT_ORDER.ui)
      .setVisible(false)
    const sideWithPossession = this.ball.playerWithBall ? this.ball.playerWithBall.side : ''
    this.changingPossessionText = this.add
      .text(0, 0, `${sideWithPossession} BALL!`, {
        fontSize: '20px',
      })
      .setDepth(SORT_ORDER.ui)
      .setVisible(false)
    this.changingPossessionText.setPosition(
      WINDOW_WIDTH / 2 - this.changingPossessionText.displayWidth / 2,
      WINDOW_HEIGHT / 2 - this.changingPossessionText.displayHeight / 2
    )
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

  handleChangePossession(prevSideWithPossession: Side) {
    this.player.getCourtPlayers().forEach((player) => {
      player.stop()
    })
    this.cpu.getCourtPlayers().forEach((player) => {
      player.stop()
    })
    this.isChangingPossession = true
    this.changingPossessionOverlay.setVisible(true)
    const newSideWithPossession = prevSideWithPossession === Side.CPU ? Side.PLAYER : Side.CPU
    const newTeamWithPossession = newSideWithPossession === Side.CPU ? this.cpu : this.player

    this.changingPossessionText.setText(`${newSideWithPossession} BALL!`).setVisible(true)
    this.changingPossessionText.setPosition(
      WINDOW_WIDTH / 2 - this.changingPossessionText.displayWidth / 2,
      WINDOW_HEIGHT / 2 - this.changingPossessionText.displayHeight / 2
    )
    this.time.delayedCall(5000, () => {
      newTeamWithPossession.handleNewPossession()
      this.resetPositioning()
    })
  }

  resetPositioning() {
    this.changingPossessionOverlay.setVisible(false)
    this.changingPossessionText.setVisible(false)

    this.player.positionPlayers()
    this.cpu.positionPlayers()
    this.isChangingPossession = false
  }

  update() {
    this.ball.update()
    this.player.update()
    this.cpu.update()
  }
}
