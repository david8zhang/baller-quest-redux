import Game from '~/scenes/Game'

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
  private idleAnimKey: string = 'dribble-front'

  constructor(game: Game, config: CourtPlayerConfig) {
    this.game = game
    const { position } = config
    this.sprite = this.game.physics.add.sprite(position.x, position.y, 'idle').setScale(2)
    this.sprite.anims.play(this.idleAnimKey)
  }

  isMoving() {
    const velocity = this.sprite.body.velocity
    return Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0
  }

  shoot() {
    if (!this.isMoving()) {
      const jumpTime = 1
      const xPosToLand = this.sprite.x
      const yPosToLand = this.sprite.y
      const xVelocity = (xPosToLand - this.sprite.x) / jumpTime
      const yVelocity = (yPosToLand - this.sprite.y - 490 * Math.pow(jumpTime, 2)) / jumpTime
      this.isShooting = true
      this.sprite.setGravityY(980)
      this.sprite.setVelocity(xVelocity, yVelocity)
      this.game.time.delayedCall(jumpTime * 975, () => {
        this.sprite.setGravityY(0)
        this.idleAnimKey = 'idle'
        this.isShooting = false
      })
      this.sprite.anims.stop()
      this.sprite.setTexture('shoot')
    }
  }

  stop() {
    if (!this.isShooting) {
      this.sprite.setVelocity(0, 0)
      this.sprite.anims.play(this.idleAnimKey, true)
    }
  }

  setVelocityX(xVelocity: number) {
    this.sprite.setFlipX(xVelocity > 0)
    this.sprite.setVelocityX(xVelocity)
    this.sprite.anims.play('run-with-ball', true)
  }

  setVelocityY(yVelocity: number) {
    this.sprite.setVelocityY(yVelocity)
    this.sprite.anims.play('run-with-ball', true)
  }
}
