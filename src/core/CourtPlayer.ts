import Game from '~/scenes/Game'
import { BallState } from './Ball'
import { createArc, getDistanceBetween, OFFBALL_ANIMS, ONBALL_ANIMS, Side } from './Constants'

export interface CourtPlayerConfig {
  position: {
    x: number
    y: number
  }
  side: Side
  tint?: number
}

export class CourtPlayer {
  private game: Game
  public side: Side
  public sprite: Phaser.Physics.Arcade.Sprite
  public hasPossession: boolean = false
  public isShooting: boolean = false
  public isPassing: boolean = false

  constructor(game: Game, config: CourtPlayerConfig) {
    this.game = game
    const { position, side, tint } = config
    this.side = side
    this.sprite = this.game.physics.add
      .sprite(position.x, position.y, 'idle')
      .setScale(3)
      .setDebug(true, true, 0x00ff00)
    if (tint) {
      this.sprite.setTintFill(tint)
    }
    this.sprite.body.setSize(16, 20)
    this.sprite.body.offset.y = 10
    this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle)
    this.sprite.setData('ref', this)
    this.sprite.setCollideWorldBounds(true)
  }

  canPassBall() {
    return this.hasPossession && !this.isShooting
  }

  isMoving() {
    const velocity = this.sprite.body.velocity
    return Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0
  }

  shoot() {
    this.playJumpAnimation()
  }

  canShootBall() {
    return !this.isShooting && this.hasPossession
  }

  handleBallCollision() {
    if (this.game.ball.ballState === BallState.LOOSE) {
      // Make sure that the player who is passing can't regain posssession of the ball mid-pass
      if (!this.isPassing) {
        this.getPossessionOfBall()
        if (this.side === Side.PLAYER) {
          this.game.player.setSelectedCourtPlayer(this)
        }
      }
    }
  }

  launchBallTowardsHoop() {
    const ball = this.game.ball
    ball.show()
    ball.ballState = BallState.SHOOTING
    this.game.ball.setPosition(this.sprite.x + 5, this.sprite.y - 28)
    createArc(
      ball.sprite,
      {
        x: this.game.hoop.rimSprite.x,
        y: this.game.hoop.rimSprite.y - 20,
      },
      1.5
    )
  }

  playJumpAnimation() {
    this.stop()
    this.sprite.body.checkCollision.none = true
    this.hasPossession = false
    this.sprite.setFlipX(false)
    const jumpTime = 0.7
    const initialX = this.sprite.x
    const initialY = this.sprite.y
    this.sprite.anims.stop()
    this.sprite.setTexture('shoot-jump')

    createArc(this.sprite, { x: initialX, y: initialY }, jumpTime)
    this.isShooting = true
    this.game.time.delayedCall(jumpTime * 975 * 0.45, () => {
      this.sprite.setTexture('shoot-flick')
      this.game.ball.playerWithBall = null
      this.launchBallTowardsHoop()
    })
    this.game.time.delayedCall(jumpTime * 975, () => {
      this.onShootingCompleted()
    })
  }

  onShootingCompleted() {
    this.sprite.body.checkCollision.none = false
    this.isShooting = false
    this.sprite.setVelocity(0, 0)
    this.sprite.setGravityY(0)
    this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle, true)
  }

  get x() {
    return this.sprite.x
  }

  get y() {
    return this.sprite.y
  }

  canMove() {
    return !this.isShooting
  }

  passBall(receiver: CourtPlayer) {
    if (!this.hasPossession) {
      return
    }
    const timeToPass = 0.25
    const angle = Phaser.Math.Angle.BetweenPoints(
      {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      {
        x: receiver.sprite.x + receiver.sprite.body.velocity.x * timeToPass,
        y: receiver.sprite.y + receiver.sprite.body.velocity.y * timeToPass,
      }
    )
    const posAfterGivenTime = {
      x: receiver.sprite.x + receiver.sprite.body.velocity.x * timeToPass,
      y: receiver.sprite.y + receiver.sprite.body.velocity.y * timeToPass,
    }
    const distance = getDistanceBetween(
      {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      posAfterGivenTime
    )
    const velocityVector = new Phaser.Math.Vector2(0, 0)
    this.game.physics.velocityFromRotation(angle, distance * (1 / timeToPass), velocityVector)
    this.hasPossession = false
    this.game.ball.playerWithBall = null
    this.isPassing = true
    this.game.time.delayedCall(timeToPass * 1000, () => {
      this.isPassing = false
    })

    // Apply ball changes
    this.game.ball.ballState = BallState.LOOSE
    this.game.ball.sprite.setVisible(true)
    this.game.ball.sprite.setGravity(0)
    this.game.ball.sprite.setVelocity(velocityVector.x, velocityVector.y)
  }

  losePossessionOfBall() {
    this.hasPossession = false
    this.sprite.anims.play(OFFBALL_ANIMS.idle)
  }

  getPossessionOfBall() {
    this.hasPossession = true
    this.game.ball.ballState = BallState.DRIBBLING
    this.sprite.anims.play(ONBALL_ANIMS.idle)
    this.game.ball.hide()
    this.game.ball.setPosition(this.sprite.x, this.sprite.y)
    this.game.ball.sprite.setGravity(0)
    this.game.ball.playerWithBall = this
  }

  stop() {
    this.sprite.setFlipX(false)
    // if the player is currently in their shooting motion
    if (!this.isShooting) {
      this.sprite.setVelocity(0, 0)
      this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle, true)
    }
  }

  setVelocityX(xVelocity: number) {
    this.sprite.setFlipX(xVelocity > 0)
    this.sprite.setVelocityX(xVelocity)
    this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.run : OFFBALL_ANIMS.run, true)
  }

  setVelocityY(yVelocity: number) {
    this.sprite.setVelocityY(yVelocity)
    this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.run : OFFBALL_ANIMS.run, true)
  }
}
