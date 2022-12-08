import Game from '~/scenes/Game'
import { PLAYER_SPEED, WINDOW_HEIGHT, WINDOW_WIDTH } from './Constants'
import { CourtPlayer } from './CourtPlayer'

export class Player {
  private game: Game
  private selectedCourtPlayer: CourtPlayer

  private keyArrowLeft!: Phaser.Input.Keyboard.Key
  private keyArrowRight!: Phaser.Input.Keyboard.Key
  private keyArrowUp!: Phaser.Input.Keyboard.Key
  private keyArrowDown!: Phaser.Input.Keyboard.Key

  constructor(game: Game) {
    this.game = game
    this.selectedCourtPlayer = new CourtPlayer(this.game, {
      position: {
        x: WINDOW_WIDTH / 2,
        y: WINDOW_HEIGHT / 2,
      },
    })
    this.selectedCourtPlayer.getPossessionOfBall()
    this.setupMovementKeys()
    this.setupKeyboardPressListener()
  }
  setupKeyboardPressListener() {
    this.game.input.keyboard.on('keydown', (e) => {
      if (e.code === 'Space') {
        this.selectedCourtPlayer.shoot()
      }
    })
  }

  getSelectedCourtPlayer() {
    return this.selectedCourtPlayer
  }

  setupMovementKeys() {
    this.keyArrowLeft = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.keyArrowRight = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    this.keyArrowUp = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.keyArrowDown = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
  }

  update() {
    if (!this.keyArrowLeft || !this.keyArrowRight || !this.keyArrowUp || !this.keyArrowDown) {
      return
    }
    const leftDown = this.keyArrowLeft.isDown
    const rightDown = this.keyArrowRight.isDown
    const upDown = this.keyArrowUp.isDown
    const downDown = this.keyArrowDown.isDown

    const speed = PLAYER_SPEED
    let velocityX = 0
    let velocityY = 0
    if (leftDown || rightDown) {
      if (leftDown && rightDown) {
        velocityX = 0
      }
      velocityX = leftDown ? -speed : speed
    } else {
      velocityX = 0
    }
    if (upDown || downDown) {
      if (upDown && downDown) {
        velocityY = 0
      }
      velocityY = upDown ? -speed : speed
    } else {
      velocityY = 0
    }
    if (velocityX == 0 && velocityY == 0) {
      this.selectedCourtPlayer.stop()
    } else {
      this.selectedCourtPlayer.setVelocityX(velocityX)
      this.selectedCourtPlayer.setVelocityY(velocityY)
    }
  }
}
