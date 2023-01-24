import { BallState } from '~/core/Ball'
import { createArc, STEAL_LIKELIHOOD_ATTRIBUTE_MAPPING } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export interface StealStateConfig {
  onStealCallback: Function
}

export class StealState extends State {
  enter(currPlayer: CourtPlayer, team: Team, onStealFinished: Function) {
    const ball = team.game.ball
    const ballHandler = ball.playerWithBall

    currPlayer.sprite.anims.stop()
    currPlayer.setVelocity(0, 0)
    const animSuffix = team.side.toLowerCase()
    currPlayer.sprite.setTexture(`steal-wind-${animSuffix}`)

    if (ballHandler) {
      this.playStealAnimation(
        currPlayer,
        team,
        () => {
          if (this.didStealSucceed(currPlayer, ballHandler)) {
            this.launchBallBackwardsAfterSteal(currPlayer, ballHandler)
          }
        },
        onStealFinished
      )
    } else {
      this.playStealAnimation(currPlayer, team, null, onStealFinished)
    }
  }

  playStealAnimation(
    currPlayer: CourtPlayer,
    team: Team,
    onStealCb: Function | null,
    onStealFinished: Function | null
  ) {
    const animSuffix = team.side.toLowerCase()
    Game.instance.time.delayedCall(100, () => {
      currPlayer.sprite.setTexture(`steal-reach-${animSuffix}`)
      if (onStealCb) {
        onStealCb()
      }
      Game.instance.time.delayedCall(150, () => {
        currPlayer.sprite.setTexture(`steal-follow-${animSuffix}`)
        Game.instance.time.delayedCall(250, () => {
          if (onStealFinished) {
            onStealFinished(currPlayer)
          }
        })
      })
    })
  }

  didStealSucceed(currPlayer: CourtPlayer, ballHandler: CourtPlayer) {
    return true
    // const distanceToBallHandler = Phaser.Math.Distance.Between(
    //   currPlayer.sprite.x,
    //   currPlayer.sprite.y,
    //   ballHandler.sprite.x,
    //   ballHandler.sprite.y
    // )
    // const stealSuccessPct =
    //   STEAL_LIKELIHOOD_ATTRIBUTE_MAPPING[currPlayer.attributes.steal.toString()]
    // return (
    //   Phaser.Math.Between(0, 100) <= stealSuccessPct &&
    //   distanceToBallHandler < 75 &&
    //   ballHandler.getCurrState().key !== States.PASSING &&
    //   ballHandler.getCurrState().key !== States.SHOOTING &&
    //   ballHandler.getCurrState().key !== States.LAYUP &&
    //   ballHandler.getCurrState().key !== States.DUNK
    // )
  }

  launchBallBackwardsAfterSteal(currPlayer: CourtPlayer, ballHandler: CourtPlayer) {
    ballHandler.setState(States.FUMBLE)
    Game.instance.cameras.main.shake(150, 0.005)
    const xDiff = Phaser.Math.Between(0, 1) == 0 ? 32 : -32
    const point = {
      x: ballHandler.sprite.x + xDiff,
      y: ballHandler.sprite.y + ballHandler.sprite.displayHeight,
    }
    const ball = Game.instance.ball
    ball.sprite.setDepth(ballHandler.sprite.depth + 1)
    ball.blockShotFloor.setPosition(
      point.x,
      Math.max(point.y, Game.instance.court.behindBackboardWallSprite.y + 25)
    )
    ball.blockShotFloorCollider.active = true
    ball.show()
    const stealDeflectDuration = 0.5
    ballHandler.losePossessionOfBall()
    ball.giveUpPossession()
    createArc(ball.sprite, point, stealDeflectDuration)
    Game.instance.time.delayedCall(stealDeflectDuration * 1000, () => {
      ball.ballState = BallState.STOLEN
    })
    Game.instance.time.delayedCall(stealDeflectDuration * 2000, () => {
      ballHandler.setState(States.IDLE)
    })
  }
}
