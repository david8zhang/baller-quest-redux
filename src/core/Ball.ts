import Game from '~/scenes/Game'
import { createArc, SORT_ORDER, WINDOW_WIDTH } from './Constants'
import { CourtPlayer } from './CourtPlayer'

export interface BallConfig {
  position: {
    x: number
    y: number
  }
}

export enum BallState {
  MADE_TWO_POINT_SHOT = 'MADE_TWO_POINT_SHOT',
  MADE_THREE_POINT_SHOT = 'MADE_THREE_POINT_SHOT',
  MISSED_SHOT = 'MISSED_SHOT',
  LOOSE = 'LOOSE',
  DRIBBLING = 'DRIBBLING',
  PASS = 'PASS',
  DUNK = 'DUNK',
  POST_MADE_SHOT = 'POST_MADE_SHOT',
  BLOCKED = 'BLOCKED',
}

export class Ball {
  private game: Game
  public ballState: BallState = BallState.LOOSE
  public sprite: Phaser.Physics.Arcade.Sprite
  public prevPlayerWithBall: CourtPlayer | null = null
  public playerWithBall: CourtPlayer | null = null
  public floorCollider!: Phaser.Physics.Arcade.Collider
  public ballStateText: Phaser.GameObjects.Text
  public isRebounding: boolean = false

  // Floor for ball to bounce on when shot is blocked
  public blockShotFloor!: Phaser.Physics.Arcade.Sprite
  public blockShotFloorCollider!: Phaser.Physics.Arcade.Collider

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
    this.ballStateText = this.game.add
      .text(this.sprite.x, this.sprite.y, this.ballState, {
        fontSize: '12px',
        color: 'black',
      })
      .setDepth(SORT_ORDER.ui)
      .setVisible(false)
    this.setupBlockShotFloor()
  }

  setupBlockShotFloor() {
    this.blockShotFloor = this.game.physics.add.sprite(0, 0, '').setVisible(false)
    this.blockShotFloor.setDisplaySize(WINDOW_WIDTH, 10)
    this.blockShotFloor.setDebugBodyColor(0xa020f0)
    this.blockShotFloor.setImmovable(true)
    this.blockShotFloorCollider = this.game.physics.add.collider(this.blockShotFloor, this.sprite)
    this.blockShotFloorCollider.active = false
  }

  handlePlayerCollision() {
    if (
      this.ballState !== BallState.DUNK &&
      this.ballState !== BallState.POST_MADE_SHOT &&
      this.ballState !== BallState.MADE_TWO_POINT_SHOT &&
      this.ballState !== BallState.MADE_THREE_POINT_SHOT
    ) {
      this.floorCollider.active = false
    }
  }

  giveUpPossession() {
    this.prevPlayerWithBall = this.playerWithBall
    this.playerWithBall = null
  }

  setupHoopCollider() {
    this.floorCollider = this.game.physics.add.collider(
      this.game.hoop.floorSprite,
      this.sprite,
      () => {
        if (
          this.ballState === BallState.DUNK ||
          this.ballState === BallState.MADE_TWO_POINT_SHOT ||
          this.ballState === BallState.MADE_THREE_POINT_SHOT
        ) {
          const points = this.ballState === BallState.MADE_THREE_POINT_SHOT ? 3 : 2
          Game.instance.onScore(this.prevPlayerWithBall!.side, points)
          this.ballState = BallState.POST_MADE_SHOT
          this.game.handleChangePossession(this.prevPlayerWithBall!.side)
        }
      }
    )
    this.floorCollider.active = false
    this.game.physics.add.overlap(this.sprite, this.game.hoop.rimSprite, (obj1, obj2) => {
      // If the ball was dunked
      if (this.ballState == BallState.DUNK) {
        this.show()
        this.sprite.setVelocityX(0)
        this.sprite.setVelocityY(100)
        this.sprite.setGravityY(980)
        this.floorCollider.active = true
      }

      // Check if ball is falling downward
      if (this.sprite.body.velocity.y > 0) {
        if (
          this.ballState === BallState.MADE_TWO_POINT_SHOT ||
          this.ballState === BallState.MADE_THREE_POINT_SHOT
        ) {
          this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.7)
          this.sprite.setVelocityY(this.sprite.body.velocity.y * 0.85)
        } else if (this.ballState === BallState.MISSED_SHOT) {
          // Rebound
          this.isRebounding = true
          this.ballState = BallState.LOOSE
          const missOffset = Phaser.Math.Between(0, 1) > 0 ? -50 : 50
          createArc(
            this.sprite,
            {
              x: this.game.hoop.standSprite.x + missOffset,
              y: this.game.hoop.standSprite.y - 50,
            },
            0.5
          )
        }
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
      this.ballStateText.setVisible(false)
    }
  }
}
