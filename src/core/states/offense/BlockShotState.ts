import { BallState } from '~/core/Ball'
import { createArc } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class BlockShotState extends State {
  enter(currPlayer: CourtPlayer, team: Team, callback: Function) {
    const shooter = team.getOtherTeamCourtPlayers().find((player) => {
      return player.getCurrState().key === States.SHOOTING
    })
    if (shooter && !shooter.wasShotBlocked) {
      currPlayer.sprite.setFlipX(false)
      currPlayer.sprite.anims.stop()
      console.log('Block wind up')
      currPlayer.sprite.setTexture('block-front-wind-up')
      currPlayer.sprite.body.checkCollision.none = true
      shooter.wasShotBlocked = true
      const jumpTime = 0.7

      const lineToShooter = new Phaser.Geom.Line(
        currPlayer.sprite.x,
        currPlayer.sprite.y,
        shooter.sprite.x,
        shooter.sprite.y
      )
      createArc(currPlayer.sprite, lineToShooter.getPoint(0.5), jumpTime)
      Game.instance.time.delayedCall(jumpTime * 485, () => {
        currPlayer.sprite.setTexture('block-front-swing')
        this.launchBallBackwardsAfterBlock(currPlayer, shooter)
      })

      Game.instance.time.delayedCall(jumpTime * 1000, () => {
        currPlayer.sprite.body.checkCollision.none = false
        if (callback) {
          callback(currPlayer)
        } else {
          currPlayer.setState(States.IDLE)
        }
      })
    }
  }

  launchBallBackwardsAfterBlock(currPlayer: CourtPlayer, shooter: CourtPlayer) {
    Game.instance.cameras.main.shake(150, 0.005)
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
    ball.sprite.setPosition(shooter.sprite.x, shooter.sprite.y - shooter.sprite.displayHeight / 2)
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
