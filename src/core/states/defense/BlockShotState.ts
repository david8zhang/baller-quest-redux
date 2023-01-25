import { BallState } from '~/core/Ball'
import { createArc, Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class BlockShotState extends State {
  enter(currPlayer: CourtPlayer, team: Team, callback: Function) {
    const shooter = team.getOtherTeamCourtPlayers().find((player) => {
      return (
        player.getCurrState().key === States.SHOOTING || player.getCurrState().key === States.LAYUP
      )
    })
    const suffix = currPlayer.side === Side.CPU ? 'cpu' : 'player'
    if (shooter && !shooter.wasShotBlocked) {
      currPlayer.sprite.setFlipX(false)
      currPlayer.sprite.anims.stop()
      currPlayer.sprite.setVelocity(0, 0)
      currPlayer.sprite.setTexture(`block-front-wind-up-${suffix}`)
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
        Game.instance.ball.ballState = BallState.BLOCKED
        currPlayer.sprite.setTexture(`block-front-swing-${suffix}`)
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
    ball.blockShotFloor.setPosition(
      point.x,
      Math.max(point.y, Game.instance.court.behindBackboardWallSprite.y + 25)
    )
    ball.blockShotFloorCollider.active = true
    ball.show()
    const blockArcDuration = 1
    createArc(ball.sprite, point, blockArcDuration)
    Game.instance.time.delayedCall(blockArcDuration * 1000, () => {
      shooter.wasShotBlocked = false
    })
  }
}
