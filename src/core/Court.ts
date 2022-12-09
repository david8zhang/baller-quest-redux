import Game from '~/scenes/Game'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './Constants'

export class Court {
  private game: Game
  public isVisible: boolean = false
  private static FIELD_ZONE_WIDTH = 32
  private static FIELD_ZONE_HEIGHT = 32
  private objects: Phaser.GameObjects.Group
  public grid: Phaser.GameObjects.Rectangle[][] = []
  public onDebugToggleHooks: Function[] = []

  constructor(game: Game) {
    this.game = game
    this.objects = this.game.add.group()
    this.debugFieldGrid()
    this.handleDebugToggleInput()
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
          .setStrokeStyle(3, 0x00ff00, 1)
          .setVisible(this.isVisible)
          .setDepth(100)
        const text = this.game.add
          .text(position.x, position.y, `${i},${j}`)
          .setTintFill(0x00ff00)
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
