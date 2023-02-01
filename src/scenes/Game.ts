import Phaser from 'phaser'
import { Ball } from '~/core/Ball'
import { DEFAULT_FONT, Side, SORT_ORDER, WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { Court } from '~/core/Court'
import { CourtPlayer } from '~/core/CourtPlayer'
import { createPlayerAnims } from '~/core/CourtPlayerAnims'
import { CPUTeam } from '~/core/cpu/CPUTeam'
import { Cursor } from '~/core/Cursor'
import { Hoop } from '~/core/Hoop'
import { createNetAnims } from '~/core/NetAnims'
import { PlayerTeam } from '~/core/player/PlayerTeam'
import { ScoreTracker } from '~/core/ScoreTracker'
import { ShotClock } from '~/core/ShotClock'
import { States } from '~/core/states/States'
import { Timer } from '~/core/Timer'

export default class Game extends Phaser.Scene {
  public timer!: Timer
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
  private scoreTracker!: ScoreTracker
  public shotClock!: ShotClock
  private static _instance: Game

  public postFxPlugin: any
  public ignoreDepthSortingNames = ['hoop', 'rim', 'shooting', 'ball', 'court', 'highlight', 'ui']

  constructor() {
    super('game')
    Game._instance = this
  }

  public static get instance() {
    return Game._instance
  }

  init() {
    this.isChangingPossession = false
  }

  onScore(side: Side, numPoints: number) {
    this.scoreTracker.increaseScore(numPoints, side)
  }

  initPlugins() {
    this.postFxPlugin = this.plugins.get('rexOutlinePipeline')
  }

  create() {
    this.initPlugins()
    createPlayerAnims(this.anims)
    createNetAnims(this.anims)
    this.timer = new Timer(this, () => {
      this.handleMatchFinished()
    })
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

    this.scoreTracker = new ScoreTracker(this)
    this.shotClock = new ShotClock(this)
    this.setupColliders()
    this.setupUI()
  }

  handleMatchFinished() {
    this.scene.start('gameover', {
      playerScore: this.scoreTracker.playerScore,
      cpuScore: this.scoreTracker.cpuScore,
    })
  }

  setupUI() {
    this.changingPossessionOverlay = this.add
      .rectangle(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2, WINDOW_WIDTH, WINDOW_HEIGHT, 0x000000, 0.5)
      .setDepth(SORT_ORDER.ui)
      .setName('ui')
      .setVisible(false)
    const sideWithPossession = this.ball.playerWithBall ? this.ball.playerWithBall.side : ''
    this.changingPossessionText = this.add
      .text(0, 0, `${sideWithPossession} BALL!`, {
        fontSize: '30px',
        fontFamily: DEFAULT_FONT,
      })
      .setDepth(SORT_ORDER.ui + 100)
      .setName('ui')
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
  }

  handleChangePossession(prevSideWithPossession: Side) {
    if (this.timer.currSeconds === 0) {
      this.handleMatchFinished()
    } else {
      // Reset all player states
      this.player.getCourtPlayers().forEach((player) => {
        if (prevSideWithPossession === Side.PLAYER && player.hasPossession) {
          player.losePossessionOfBall()
        }
        player.setState(States.IDLE)
      })
      this.cpu.getCourtPlayers().forEach((player) => {
        if (prevSideWithPossession === Side.CPU && player.hasPossession) {
          player.losePossessionOfBall()
        }
        player.setState(States.IDLE)
      })
      this.isChangingPossession = true
      this.changingPossessionOverlay.setVisible(true).setDepth(SORT_ORDER.ui + 1000)
      const newSideWithPossession = prevSideWithPossession === Side.CPU ? Side.PLAYER : Side.CPU
      const newTeamWithPossession = newSideWithPossession === Side.CPU ? this.cpu : this.player
      const newTeamOnDefense = newSideWithPossession === Side.CPU ? this.player : this.cpu

      this.changingPossessionText
        .setText(`${newSideWithPossession} BALL!`)
        .setVisible(true)
        .setDepth(SORT_ORDER.ui + 1000)
      this.changingPossessionText
        .setPosition(
          WINDOW_WIDTH / 2 - this.changingPossessionText.displayWidth / 2,
          WINDOW_HEIGHT / 2 - this.changingPossessionText.displayHeight / 2
        )
        .setDepth(SORT_ORDER.ui + 1000)
      this.time.delayedCall(1500, () => {
        // Turn off all ball colliders
        this.ball.floorCollider.active = false
        this.ball.blockShotFloorCollider.active = false
        this.ball.prevPlayerWithBall = null
        newTeamWithPossession.handleNewPossession()
        newTeamOnDefense.handleNewDefenseSetup()
        this.resetPositioning()
        this.shotClock.resetShotClockOnNewPossession()
        this.isChangingPossession = false
      })
    }
  }

  resetPositioning() {
    this.changingPossessionOverlay.setVisible(false)
    this.changingPossessionText.setVisible(false)
    this.player.positionPlayers()
    this.cpu.positionPlayers()
  }

  depthSort() {
    const sortedByY = this.sys.displayList
      .getChildren()
      .filter((child: any) => {
        return child.y && !this.ignoreDepthSortingNames.includes(child.name)
      })
      .sort((a: any, b: any) => {
        return a.y - b.y
      })
    let lowestLayer = 1
    sortedByY.forEach((c: any, index: number) => {
      if (c.setDepth) {
        c.setDepth(lowestLayer + index)
      }
    })
  }

  update() {
    this.ball.update()
    this.player.update()
    this.cpu.update()
    this.depthSort()
  }
}
