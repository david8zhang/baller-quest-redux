import Game from '~/scenes/Game'
import { getClosestPlayer, PLAYER_SPEED, Side } from './Constants'
import { CourtPlayer } from './CourtPlayer'
import { Cursor } from './Cursor'

export class Player {
  public static INITIAL_PLAYER_POSITIONS = {
    player1: {
      row: 17,
      col: 13,
    },
    player2: {
      row: 16,
      col: 20,
    },
    player3: {
      row: 16,
      col: 6,
    },
  }

  private game: Game
  private selectedCourtPlayer!: CourtPlayer
  private players: CourtPlayer[] = []
  private selectedCourtPlayerCursor: Cursor
  private passCursor: Cursor

  private keyArrowLeft!: Phaser.Input.Keyboard.Key
  private keyArrowRight!: Phaser.Input.Keyboard.Key
  private keyArrowUp!: Phaser.Input.Keyboard.Key
  private keyArrowDown!: Phaser.Input.Keyboard.Key

  constructor(game: Game) {
    this.game = game
    this.selectedCourtPlayerCursor = new Cursor(
      {
        position: { x: 0, y: 0 },
      },
      this.game
    )
    this.passCursor = new Cursor(
      {
        position: { x: 0, y: 0 },
        alpha: 0.5,
      },
      this.game
    )
    this.setupMovementKeys()
    this.setupKeyboardPressListener()
    this.setupPlayers()
  }
  setupKeyboardPressListener() {
    this.game.input.keyboard.on('keydown', (e) => {
      if (e.code === 'KeyS') {
        if (this.selectedCourtPlayer.canShootBall()) {
          this.selectedCourtPlayer.shoot()
        }
      }
      if (e.code === 'Space') {
        if (this.passCursor.selectedCourtPlayer) {
          // If the currently selected player has the ball, pass it. Otherwise, switch player
          if (this.selectedCourtPlayer.canPassBall()) {
            this.selectedCourtPlayer.passBall(this.passCursor.selectedCourtPlayer)
          } else {
            this.setSelectedCourtPlayer(this.passCursor.selectedCourtPlayer)
          }
        }
      }
    })
  }

  getCourtPlayers() {
    return this.players
  }

  setupPlayers() {
    Object.keys(Player.INITIAL_PLAYER_POSITIONS).forEach((playerId: string, index: number) => {
      const gridPos = Player.INITIAL_PLAYER_POSITIONS[playerId]
      const worldPosForRowCol = this.game.court.getWorldPositionForCoordinates(
        gridPos.row,
        gridPos.col
      )
      const newPlayer = new CourtPlayer(this.game, {
        position: worldPosForRowCol,
        side: Side.PLAYER,
        tint: 0x00ff00,
        playerId,
      })
      if (index === 0) {
        this.selectedCourtPlayer = newPlayer
        this.selectedCourtPlayer.getPossessionOfBall()
        this.selectedCourtPlayerCursor.selectCourtPlayer(this.selectedCourtPlayer)
      }
      this.players.push(newPlayer)
      this.game.playerCourtPlayers.add(newPlayer.sprite)
    })
  }

  setSelectedCourtPlayer(courtPlayer: CourtPlayer) {
    this.selectedCourtPlayer.stop()
    this.selectedCourtPlayerCursor.selectCourtPlayer(courtPlayer)
    this.selectedCourtPlayer = courtPlayer
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

  handleCourtPlayerMovement() {
    if (
      !this.keyArrowLeft ||
      !this.keyArrowRight ||
      !this.keyArrowUp ||
      !this.keyArrowDown ||
      !this.selectedCourtPlayer.canMove()
    ) {
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

  updatePassCursor() {
    const closestPlayer = getClosestPlayer(this.selectedCourtPlayer, this.players)
    this.passCursor.selectCourtPlayer(closestPlayer)
  }

  update() {
    this.selectedCourtPlayerCursor.follow()
    this.updatePassCursor()
    this.handleCourtPlayerMovement()
  }
}
