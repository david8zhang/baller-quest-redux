import Game from '~/scenes/Game'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './Constants'
import { CourtPlayer } from './CourtPlayer'

export enum ShotDistance {
  POST = 'POST',
  MID_RANGE = 'MID_RANGE',
  PERIMETER = 'PERIMETER',
}

export class Court {
  private game: Game
  private sprite: Phaser.GameObjects.Sprite
  public isVisible: boolean = false
  private static FIELD_ZONE_WIDTH = 32
  private static FIELD_ZONE_HEIGHT = 32
  private objects: Phaser.GameObjects.Group
  public grid: Phaser.GameObjects.Rectangle[][] = []
  public onDebugToggleHooks: Function[] = []
  public threePointDetectorCircle!: Phaser.Geom.Ellipse
  public midRangeDetectorCircle!: Phaser.Geom.Ellipse
  public postDetectorCircle!: Phaser.Geom.Ellipse
  public behindBackboardWallSprite!: Phaser.Physics.Arcade.Sprite

  constructor(game: Game) {
    this.game = game
    this.sprite = this.game.add
      .sprite(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2, 'court')
      .setName('court')
    this.objects = this.game.add.group()
    this.debugFieldGrid()
    this.handleDebugToggleInput()
    this.setupWallSprite()
    this.setupShotDistanceDetectorCircles()
  }

  setupShotDistanceDetectorCircles() {
    this.threePointDetectorCircle = new Phaser.Geom.Ellipse(
      WINDOW_WIDTH / 2,
      WINDOW_HEIGHT / 2 - 50,
      600,
      590
    )
    this.midRangeDetectorCircle = new Phaser.Geom.Ellipse(
      WINDOW_WIDTH / 2,
      WINDOW_HEIGHT / 2 - 50,
      400,
      390
    )
    this.postDetectorCircle = new Phaser.Geom.Ellipse(
      WINDOW_WIDTH / 2,
      WINDOW_HEIGHT / 2 - 50,
      250,
      240
    )
  }

  isThreePointShot(x: number, y: number): boolean {
    return !this.threePointDetectorCircle.contains(x, y)
  }

  setupWallSprite() {
    this.behindBackboardWallSprite = this.game.physics.add
      .sprite(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 - 60, '')
      .setVisible(false)
      .setDisplaySize(WINDOW_WIDTH, 5)
      .setDebug(true, true, 0x00ff00)
      .setImmovable(true)

    this.behindBackboardWallSprite.body.checkCollision.up = false
    this.behindBackboardWallSprite.body.checkCollision.down = true

    this.game.physics.add.collider(this.behindBackboardWallSprite, this.game.playerCourtPlayers)
    this.game.physics.add.collider(this.behindBackboardWallSprite, this.game.cpuCourtPlayers)
  }

  getRandomLocationOnPerimeter() {
    const randPct = Phaser.Math.Between(0, 50) / 100
    return this.threePointDetectorCircle.getPoint(randPct)
  }

  getRandomLocationInMidRange() {
    const randPct = Phaser.Math.Between(0, 50) / 100
    return this.midRangeDetectorCircle.getPoint(randPct)
  }

  getRandomLocationInPost() {
    const randPct = Phaser.Math.Between(0, 50) / 100
    return this.postDetectorCircle.getPoint(randPct)
  }

  getRandomPointOnCourt() {
    const randNum = Phaser.Math.Between(0, 2)
    if (randNum == 0) {
      return this.getRandomLocationInPost()
    }
    if (randNum == 1) {
      return this.getRandomLocationInMidRange()
    }
    return this.getRandomLocationOnPerimeter()
  }

  handleDebugToggleInput() {
    this.game.input.keyboard.on('keydown', (e) => {
      switch (e.code) {
        case 'Backquote': {
          this.setVisible(!this.isVisible)
          this.onDebugToggleHooks.forEach((fn) => {
            fn(this.isVisible)
          })
          break
        }
      }
    })
  }

  debugFieldGrid() {
    let position = {
      x: 20,
      y: 20,
    }
    const gridWidth = WINDOW_WIDTH / Court.FIELD_ZONE_WIDTH
    const gridHeight = WINDOW_HEIGHT / Court.FIELD_ZONE_HEIGHT

    for (let i = 0; i < gridHeight; i++) {
      this.grid.push(new Array(gridHeight))
      position.x = 20
      for (let j = 0; j < gridWidth; j++) {
        const zoneRect = this.game.add
          .rectangle(
            position.x,
            position.y,
            Court.FIELD_ZONE_WIDTH,
            Court.FIELD_ZONE_HEIGHT,
            0x000000,
            0
          )
          .setStrokeStyle(3, 0x000000, 1)
          .setVisible(this.isVisible)
          .setDepth(100)
        const text = this.game.add
          .text(position.x, position.y, `${i},${j}`)
          .setTintFill(0x000000)
          .setAlpha(1)
          .setVisible(this.isVisible)
          .setDepth(100)
          .setFontSize(8)
        text.setPosition(position.x - text.displayWidth / 2, position.y - text.displayHeight / 2)
        this.objects.add(zoneRect)
        this.objects.add(text)
        position.x += Court.FIELD_ZONE_WIDTH
        this.grid[i][j] = zoneRect
      }
      position.y += Court.FIELD_ZONE_HEIGHT
    }
  }

  getWorldPositionForCoordinates(row: number, col: number) {
    const zoneRect = this.grid[row][col]
    return {
      x: zoneRect.x,
      y: zoneRect.y,
    }
  }

  setVisible(isVisible: boolean) {
    this.isVisible = isVisible
    this.objects.setVisible(isVisible)
  }
}
