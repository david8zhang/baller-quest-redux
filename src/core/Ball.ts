import Game from '~/scenes/Game'
import { createArc, SORT_ORDER } from './Constants'
import { CourtPlayer } from './CourtPlayer'

export interface BallConfig {
  position: {
    x: number
    y: number
  }
}

export class Ball {
  private game: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public playerWithBall: CourtPlayer | null = null

  constructor(game: Game, config: BallConfig) {
    this.game = game
    const { position } = config
    this.sprite = this.game.physics.add
      .sprite(position.x, position.y, 'ball')
      .setScale(3)
      .setDepth(SORT_ORDER.ball)
    this.sprite.body.setSize(5, 5)
    this.game.physics.add.overlap(this.sprite, this.game.hoop.rimSprite, (obj1, obj2) => {
      this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.7)
      this.sprite.setVelocityY(this.sprite.body.velocity.y * 0.9)
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
      this.sprite.setVelocity(
        this.playerWithBall.sprite.body.velocity.x,
        this.playerWithBall.sprite.body.velocity.y
      )
    }
  }
}
