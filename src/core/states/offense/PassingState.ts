import { BallState } from '~/core/Ball'
import { getDistanceBetween } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export class PassingState extends State {
  enter(currPlayer: CourtPlayer, team: Team, receiver: CourtPlayer) {
    console.log('Passing ball!')
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

    // Game.instance.time.delayedCall(timeToPass * 1000, () => {
    //   currPlayer.setState(States.IDLE)
    // })
  }
}
