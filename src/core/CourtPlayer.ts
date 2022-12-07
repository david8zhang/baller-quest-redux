import Game from '~/scenes/Game'
import { createArc, OFFBALL_ANIMS, ONBALL_ANIMS } from './Constants'

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
  private hasPossession: boolean = true

  constructor(game: Game, config: CourtPlayerConfig) {
    this.game = game
    const { position } = config
    this.sprite = this.game.physics.add.sprite(position.x, position.y, 'idle').setScale(3)
    this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle)
  }

  isMoving() {
    const velocity = this.sprite.body.velocity
    return Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0
  }

  shoot() {
    if (!this.isMoving()) {
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
      })
      this.game.time.delayedCall(jumpTime * 975, () => {
        this.sprite.setGravityY(0)
        this.isShooting = false
      })
    }
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
