import { BallState } from '~/core/Ball'
import { getDistanceBetween } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

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

  enter(currPlayer: CourtPlayer, team: Team, receiver: CourtPlayer, callback?: Function) {
    const animConfig = this.getPassAnimations(currPlayer, receiver)
    currPlayer.sprite.setVelocity(0, 0)
    currPlayer.sprite.anims.stop()
    currPlayer.sprite.setFlipX(animConfig.flipX)
    currPlayer.sprite.setTexture(animConfig.anims['wind-up'])
    Game.instance.time.delayedCall(100, () => {
      currPlayer.sprite.setTexture(animConfig.anims['release'])
      const timeToPass = 0.25
      const angle = Phaser.Math.Angle.BetweenPoints(
        {
          x: currPlayer.sprite.x,
          y: currPlayer.sprite.y,
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
          x: currPlayer.sprite.x,
          y: currPlayer.sprite.y,
        },
        posAfterGivenTime
      )
      const velocityVector = new Phaser.Math.Vector2(0, 0)
      Game.instance.physics.velocityFromRotation(angle, distance * (1 / timeToPass), velocityVector)

      currPlayer.hasPossession = false
      Game.instance.ball.giveUpPossession()

      // Apply ball changes
      Game.instance.ball.ballState = BallState.PASS
      Game.instance.ball.sprite.setVisible(true)
      Game.instance.ball.sprite.setGravity(0)
      Game.instance.ball.sprite.setVelocity(velocityVector.x, velocityVector.y)

      Game.instance.time.delayedCall(timeToPass * 1000, () => {
        currPlayer.setState(States.IDLE)
        if (callback) {
          callback(currPlayer)
        }
      })
    })
  }
}
