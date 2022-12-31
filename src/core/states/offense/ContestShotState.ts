import { createArc } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class ContestShotState extends State {
  enter(currPlayer: CourtPlayer, team: Team, onCompleteCb: Function) {
    Game.instance.time.delayedCall(50, () => {
      currPlayer.stop()
      currPlayer.sprite.anims.stop()
      currPlayer.sprite.setTexture('contest-front')
      currPlayer.sprite.body.checkCollision.none = true
      const jumpTime = 0.7
      const enemyShooter = team.getOtherTeamCourtPlayers().find((p) => {
        const currState = p.getCurrState()
        return currState.key === States.SHOOTING
      })
      if (enemyShooter) {
        const lineToShooter = new Phaser.Geom.Line(
          currPlayer.sprite.x,
          currPlayer.sprite.y,
          enemyShooter.sprite.x,
          enemyShooter.sprite.y
        )
        createArc(currPlayer.sprite, lineToShooter.getPoint(0.5), jumpTime)
        Game.instance.time.delayedCall(jumpTime * 975, () => {
          currPlayer.sprite.body.checkCollision.none = false
          if (onCompleteCb) {
            onCompleteCb(currPlayer)
          } else {
            currPlayer.setState(States.IDLE)
          }
        })
      } else {
        const initialPosition = currPlayer.sprite
        createArc(
          currPlayer.sprite,
          {
            x: initialPosition.x,
            y: initialPosition.y,
          },
          jumpTime
        )
        Game.instance.time.delayedCall(jumpTime * 975, () => {
          currPlayer.sprite.body.checkCollision.none = false
          if (onCompleteCb) {
            onCompleteCb(currPlayer)
          } else {
            currPlayer.setState(States.IDLE)
          }
        })
      }
    })
  }
}
