import { BallState } from '~/core/Ball'
import { createArc } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class BlockShotState extends State {
  enter(currPlayer: CourtPlayer, team: Team) {
    const shooter = team.getOtherTeamCourtPlayers().find((player) => {
      return player.getCurrState().key === States.SHOOTING
    })
    if (shooter && !shooter.wasShotBlocked) {
      shooter.wasShotBlocked = true
      const angle = Phaser.Math.Angle.BetweenPoints(
        {
          x: shooter.sprite.x,
          y: shooter.sprite.y,
        },
        {
          x: Game.instance.hoop.rimSprite.x,
          y: Game.instance.hoop.rimSprite.y,
        }
      )

      const angleDeg = Phaser.Math.RadToDeg(angle) + 180

      const line = new Phaser.Geom.Line()
      Phaser.Geom.Line.SetToAngle(
        line,
        shooter.sprite.x,
        shooter.sprite.y,
        Phaser.Math.DegToRad(angleDeg),
        150
      )
      const point = line.getPoint(1)

      const ball = Game.instance.ball
      ball.sprite.setDepth(shooter.sprite.depth + 1)
      ball.blockShotFloor.setPosition(point.x, point.y)
      ball.blockShotFloorCollider.active = true
      ball.show()

      const blockArcDuration = 1
      createArc(ball.sprite, point, blockArcDuration)
      Game.instance.time.delayedCall(blockArcDuration * 750, () => {
        const prevShooterState = shooter.getCurrState().key as States
        shooter.setState(States.FUMBLE, prevShooterState)
        ball.ballState = BallState.BLOCKED
      })
      Game.instance.time.delayedCall(blockArcDuration * 1000, () => {
        shooter.wasShotBlocked = false
      })
    }
  }
}
