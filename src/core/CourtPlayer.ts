import Game from '~/scenes/Game'
import { BallState } from './Ball'
import { createArc, getDistanceBetween, OFFBALL_ANIMS, ONBALL_ANIMS } from './Constants'

export interface CourtPlayerConfig {
  position: {
    x: number
    y: number
  }
}

export class CourtPlayer {
  private game: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  private isShooting: boolean = false
  private hasPossession: boolean = false
  public isPassing: boolean = false

  constructor(game: Game, config: CourtPlayerConfig) {
    this.game = game
    const { position } = config
    this.sprite = this.game.physics.add
      .sprite(position.x, position.y, 'idle')
      .setScale(3)
      .setDebug(true, true, 0x00ff00)
    this.sprite.body.setSize(16, 24)
    this.sprite.body.offset.y = 10
    this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle)
    this.sprite.setData('ref', this)
  }

  isMoving() {
    const velocity = this.sprite.body.velocity
    return Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0
  }

  shoot() {
    if (!this.isMoving()) {
      this.playJumpAnimation()
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
    this.sprite.setFlipX(false)
    const jumpTime = 0.7
    const initialX = this.sprite.x
    const initialY = this.sprite.y
    this.sprite.anims.stop()
    this.sprite.setTexture('shoot-jump')

    createArc(this.sprite, { x: initialX, y: initialY }, jumpTime)
    this.isShooting = true
    this.game.time.delayedCall(jumpTime * 975 * 0.45, () => {
      this.hasPossession = false
      this.sprite.setTexture('shoot-flick')
      this.game.ball.playerWithBall = null
      this.launchBallTowardsHoop()
    })
    this.game.time.delayedCall(jumpTime * 975, () => {
      this.sprite.setGravityY(0)
      this.isShooting = false
    })
  }

  get x() {
    return this.sprite.x
  }

  get y() {
    return this.sprite.y
  }

  passBall(receiver: CourtPlayer) {
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
