import Game from '~/scenes/Game'
import { createArc, Side, SORT_ORDER } from './Constants'
import { CourtPlayer } from './CourtPlayer'

export interface BallConfig {
  position: {
    x: number
    y: number
  }
}

export enum BallState {
  SHOOTING = 'SHOOTING',
  LOOSE = 'LOOSE',
  DRIBBLING = 'DRIBBLING',
  PASS = 'PASS',
}

export class Ball {
  private game: Game
  public ballState: BallState = BallState.LOOSE
  public sprite: Phaser.Physics.Arcade.Sprite
  public playerWithBall: CourtPlayer | null = null
  public floorCollider!: Phaser.Physics.Arcade.Collider

  constructor(game: Game, config: BallConfig) {
    this.game = game
    const { position } = config
    this.sprite = this.game.physics.add
      .sprite(position.x, position.y, 'ball')
      .setScale(3)
      .setDepth(SORT_ORDER.ball)
      .setBounce(0.8)
    this.sprite.body.setSize(5, 5)
    this.setupHoopCollider()
    this.sprite.setCollideWorldBounds(true)
  }

  handlePlayerCollision() {
    this.floorCollider.active = false
  }

  setupHoopCollider() {
    this.floorCollider = this.game.physics.add.collider(this.game.hoop.floorSprite, this.sprite)
    this.floorCollider.active = false
    this.game.physics.add.overlap(this.sprite, this.game.hoop.rimSprite, (obj1, obj2) => {
      // Check if ball is falling downward
      if (this.sprite.body.velocity.y > 0 && this.ballState === BallState.SHOOTING) {
        this.ballState = BallState.LOOSE
        this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.7)
        this.sprite.setVelocityY(this.sprite.body.velocity.y * 0.9)
        this.floorCollider.active = true
      }
    })
  }

  setPosition(x: number, y: number) {
    this.sprite.setPosition(x, y)
  }

  hide() {
    this.sprite.setVisible(false)
  }

  show() {
    this.sprite.setVisible(true)
  }

  update() {
    if (this.playerWithBall) {
      this.sprite.setPosition(this.playerWithBall.sprite.x, this.playerWithBall.sprite.y)
    }
  }
}
