import Game from '~/scenes/Game'
import { BallState } from './Ball'
import {
  createArc,
  getDistanceBetween,
  OFFBALL_ANIMS,
  ONBALL_ANIMS,
  PLAYER_SPEED,
  Side,
} from './Constants'

export enum CourtPlayerState {
  SHOOTING = 'SHOOTING',
  DRIBBLING = 'DRIBBLING',
  PASSING = 'PASSING',
  CONTESTING = 'CONTESTING',
  IDLE = 'IDLE',
}

export interface CourtPlayerConfig {
  position: {
    x: number
    y: number
  }
  side: Side
  playerId: string
  tint?: number
}

export class CourtPlayer {
  private game: Game
  public side: Side
  public sprite: Phaser.Physics.Arcade.Sprite
  public hasPossession: boolean = false

  public state: CourtPlayerState = CourtPlayerState.IDLE
  public playerId: string

  constructor(game: Game, config: CourtPlayerConfig) {
    this.game = game
    const { position, side, tint, playerId } = config
    this.playerId = playerId
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
    return this.hasPossession && this.state !== CourtPlayerState.SHOOTING
  }

  isMoving() {
    const velocity = this.sprite.body.velocity
    return Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0
  }

  shoot() {
    this.playJumpAnimation()
  }

  getState() {
    return this.state
  }

  setState(state: CourtPlayerState) {
    this.state = state
  }

  canShootBall() {
    return this.state !== CourtPlayerState.SHOOTING && this.hasPossession
  }

  handleBallCollision() {
    if (this.game.ball.ballState === BallState.LOOSE) {
      // Make sure that the player who is passing can't regain posssession of the ball mid-pass
      if (this.state !== CourtPlayerState.PASSING) {
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
    this.game.ball.setPosition(this.sprite.x + 5, this.sprite.y - 28)

    const isMiss = Phaser.Math.Between(0, 100) > 0
    let posToLandX = this.game.hoop.rimSprite.x
    if (isMiss) {
      ball.ballState = BallState.MISSED_SHOT
      const missOffset = Phaser.Math.Between(0, 1) ? -10 : 10
      posToLandX = this.game.hoop.rimSprite.x + missOffset
    } else {
      ball.ballState = BallState.MADE_SHOT
    }
    createArc(
      ball.sprite,
      {
        x: posToLandX,
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
    this.setState(CourtPlayerState.SHOOTING)
    this.game.time.delayedCall(jumpTime * 975 * 0.45, () => {
      this.sprite.setTexture('shoot-flick')
      this.game.ball.playerWithBall = null
      this.launchBallTowardsHoop()
    })
    this.game.time.delayedCall(jumpTime * 975, () => {
      this.landAfterJumping()
    })
  }

  landAfterJumping() {
    this.sprite.body.checkCollision.none = false
    this.setState(CourtPlayerState.IDLE)
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
    return this.state !== CourtPlayerState.SHOOTING
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
    this.setState(CourtPlayerState.PASSING)
    this.game.time.delayedCall(timeToPass * 1000, () => {
      this.setState(CourtPlayerState.PASSING)
    })

    // Apply ball changes
    this.game.ball.ballState = BallState.LOOSE
    this.game.ball.sprite.setVisible(true)
    this.game.ball.sprite.setGravity(0)
    this.game.ball.sprite.setVelocity(velocityVector.x, velocityVector.y)
  }

  contestShot() {
    this.stop()
    const jumpTime = 0.7
    const initialX = this.sprite.x
    const initialY = this.sprite.y
    this.setState(CourtPlayerState.CONTESTING)
    createArc(
      this.sprite,
      {
        x: initialX,
        y: initialY,
      },
      jumpTime
    )
    this.game.time.delayedCall(jumpTime * 975, () => {
      this.setState(CourtPlayerState.IDLE)
      this.landAfterJumping()
    })
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
    if (this.state !== CourtPlayerState.SHOOTING) {
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

  isAtPoint(moveTarget: { x: number; y: number }) {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      moveTarget.x,
      moveTarget.y
    )
    return distance <= 5
  }

  moveTowards(target: { x: number; y: number }) {
    const distance = getDistanceBetween(
      {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      {
        x: target.x,
        y: target.y,
      }
    )
    if (Math.abs(distance) < 5) {
      this.sprite.setVelocity(0, 0)
    } else {
      let angle = Phaser.Math.Angle.BetweenPoints(
        {
          x: this.sprite.x,
          y: this.sprite.y,
        },
        {
          x: target.x,
          y: target.y,
        }
      )
      const velocityVector = new Phaser.Math.Vector2()
      this.game.physics.velocityFromRotation(angle, PLAYER_SPEED, velocityVector)
      this.sprite.setVelocity(velocityVector.x, velocityVector.y)
    }
  }
}
