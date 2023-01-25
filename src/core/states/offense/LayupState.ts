import { BallState } from '~/core/Ball'
import {
  calculateShotSuccessPercentage,
  createArc,
  getClosestPlayer,
  Side,
  SORT_ORDER,
} from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class LayupState extends State {
  enter(currPlayer: CourtPlayer, team: Team, onComplete?: Function) {
    currPlayer.sprite.body.checkCollision.none = true
    const hoop = Game.instance.hoop.standSprite
    const jumpDuration = 0.8
    currPlayer.sprite.anims.stop()
    const suffix = currPlayer.side === Side.CPU ? 'cpu' : 'player'
    currPlayer.sprite.setTexture(`layup-gather-front-${suffix}`)
    currPlayer.sprite.setDepth(SORT_ORDER.ui)
    createArc(
      currPlayer.sprite,
      {
        x: hoop.x,
        y: hoop.y + hoop.displayHeight / 2 + 10,
      },
      jumpDuration
    )
    currPlayer.sprite.setName('shooting')
    Game.instance.time.delayedCall(975 * jumpDuration * 0.25, () => {
      currPlayer.sprite.setTexture(`layup-arm-out-front-${suffix}`)
    })

    Game.instance.time.delayedCall(975 * jumpDuration * 0.5, () => {
      currPlayer.shotReleased = true
      currPlayer.sprite.setTexture(`layup-flick-front-${suffix}`)
      currPlayer.hasPossession = false
      Game.instance.ball.giveUpPossession()
      if (!currPlayer.wasShotBlocked) {
        this.launchBallTowardsHoop(currPlayer, team)
      }
    })
    Game.instance.time.delayedCall(975 * jumpDuration, () => {
      currPlayer.sprite.body.checkCollision.none = false
      if (onComplete) {
        onComplete(currPlayer)
      } else {
        currPlayer.setState(States.IDLE)
      }
    })
  }

  launchBallTowardsHoop(currPlayer: CourtPlayer, team: Team) {
    const ball = Game.instance.ball
    const arcTime = 0.7
    ball.show()
    Game.instance.ball.setPosition(currPlayer.sprite.x + 5, currPlayer.sprite.y - 28)
    Game.instance.ball.sprite.setDepth(SORT_ORDER.ui)
    const shotData = calculateShotSuccessPercentage(currPlayer, team, false, true)

    const isMiss = Phaser.Math.Between(0, 100) > shotData.percentage
    let posToLandX = Game.instance.hoop.rimSprite.x
    if (isMiss) {
      ball.ballState = BallState.MISSED_SHOT
      const missOffset = Phaser.Math.Between(0, 1) ? -10 : 10
      posToLandX = Game.instance.hoop.rimSprite.x + missOffset
    } else {
      ball.ballState = BallState.MADE_TWO_POINT_SHOT
    }

    Game.instance.time.delayedCall(arcTime * 500, () => {
      Game.instance.ball.sprite.setDepth(Game.instance.hoop.rimSprite.depth - 1)
    })

    createArc(
      ball.sprite,
      {
        x: posToLandX,
        y: Game.instance.hoop.rimSprite.y - 20,
      },
      arcTime
    )
  }

  exit(currPlayer: CourtPlayer) {
    currPlayer.sprite.setName('')
    currPlayer.shotReleased = false
  }
}
