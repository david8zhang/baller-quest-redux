import { BallState } from '~/core/Ball'
import { Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export interface PassConfig {
  onPassCompleteCb: Function
  onPassStartedCb: Function
}

export class PassingState extends State {
  private static ANIMATION_CONFIG = {
    side: {
      'wind-up': 'pass-side-wind-up',
      release: 'pass-side-release',
    },
    front: {
      'wind-up': 'pass-front-wind-up',
      release: 'pass-front-release',
    },
    back: {
      'wind-up': 'pass-back-wind-up',
      release: 'pass-back-release',
    },
  }

  private onPassCompleteCb: Function = () => {}
  private onPassStartedCb: Function = () => {}

  getPassAnimations(currPlayer: CourtPlayer, receiver: CourtPlayer) {
    const yDiff = receiver.sprite.y - currPlayer.sprite.y
    const xDiff = receiver.sprite.x - currPlayer.sprite.x

    if (yDiff >= -50 && yDiff <= 50) {
      const anims = PassingState.ANIMATION_CONFIG.side
      return {
        anims,
        flipX: xDiff > 0,
      }
    }
    if (yDiff > 0) {
      const anims = PassingState.ANIMATION_CONFIG.back
      return {
        anims,
        flipX: xDiff > 0,
      }
    } else {
      const anims = PassingState.ANIMATION_CONFIG.front
      return {
        anims,
        flipX: xDiff > 0,
      }
    }
  }

  enter(currPlayer: CourtPlayer, team: Team, receiver: CourtPlayer, passConfig: PassConfig) {
    if (passConfig.onPassCompleteCb) {
      this.onPassCompleteCb = passConfig.onPassCompleteCb
    }
    if (passConfig.onPassStartedCb) {
      this.onPassStartedCb = passConfig.onPassStartedCb
    }

    const animConfig = this.getPassAnimations(currPlayer, receiver)
    currPlayer.sprite.setVelocity(0, 0)
    currPlayer.sprite.anims.stop()
    currPlayer.sprite.setFlipX(animConfig.flipX)

    const suffix = currPlayer.side === Side.CPU ? 'cpu' : 'player'

    currPlayer.sprite.setTexture(`${animConfig.anims['wind-up']}-${suffix}`)
    Game.instance.time.delayedCall(100, () => {
      currPlayer.sprite.setTexture(`${animConfig.anims['release']}-${suffix}`)
      currPlayer.hasPossession = false
      const ball = Game.instance.ball
      ball.setPosition(currPlayer.x, currPlayer.y)
      ball.giveUpPossession()

      // Apply ball changes
      ball.ballState = BallState.PASS
      ball.sprite.setVisible(true)
      ball.sprite.setGravity(0)

      Game.instance.time.delayedCall(150, () => {
        if (this.onPassStartedCb) {
          this.onPassStartedCb(currPlayer)
        }
      })

      const event = Game.instance.time.addEvent({
        repeat: -1,
        delay: 10,
        callback: () => {
          if (Game.instance.ball.ballState !== BallState.PASS) {
            if (this.onPassCompleteCb) {
              this.onPassCompleteCb(currPlayer)
            }
            event.destroy()
          } else {
            this.moveBallTowardsReceiver(receiver)
          }
        },
      })
    })
  }

  moveBallTowardsReceiver(receiver: CourtPlayer) {
    const ball = Game.instance.ball
    const angle = Phaser.Math.Angle.BetweenPoints(
      {
        x: ball.sprite.x,
        y: ball.sprite.y,
      },
      {
        x: receiver.sprite.x,
        y: receiver.sprite.y,
      }
    )
    const velocityVector = new Phaser.Math.Vector2(0, 0)
    Game.instance.physics.velocityFromRotation(angle, 1000, velocityVector)
    ball.sprite.setVelocity(velocityVector.x, velocityVector.y)
  }
}
