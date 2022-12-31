import { BallState } from '~/core/Ball'
import { createArc, getClosestPlayer } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class ShootingState extends State {
  enter(currPlayer: CourtPlayer, team: Team, callback: Function) {
    const hoop = Game.instance.hoop.standSprite
    currPlayer.stop()
    currPlayer.sprite.body.checkCollision.none = true
    currPlayer.hasPossession = false
    currPlayer.sprite.setFlipX(false)
    const jumpTime = 0.7
    const initialX = currPlayer.sprite.x
    const initialY = currPlayer.sprite.y
    currPlayer.sprite.anims.stop()
    const isSide = Math.abs(currPlayer.sprite.x - hoop.x) > 40
    let isFlipped = false

    if (currPlayer.sprite.x - hoop.x < 0) {
      currPlayer.sprite.setFlipX(true)
      isFlipped = true
    } else {
      currPlayer.sprite.setFlipX(false)
    }

    if (isSide) {
      currPlayer.sprite.setTexture('shoot-side-wind')
    } else {
      currPlayer.sprite.setTexture('shoot-jump-front')
    }

    createArc(currPlayer.sprite, { x: initialX, y: initialY }, jumpTime)
    Game.instance.time.delayedCall(jumpTime * 975 * 0.45, () => {
      if (isSide) {
        currPlayer.sprite.setTexture('shoot-side-release')
        const xOffset = isFlipped ? 10 : -10
        Game.instance.ball.setPosition(currPlayer.sprite.x + xOffset, currPlayer.sprite.y - 28)
      } else {
        currPlayer.sprite.setTexture('shoot-flick-front')
        Game.instance.ball.setPosition(currPlayer.sprite.x + 5, currPlayer.sprite.y - 28)
      }
      Game.instance.ball.giveUpPossession()
      this.launchBallTowardsHoop(currPlayer, team)
    })
    Game.instance.time.delayedCall(jumpTime * 975, () => {
      currPlayer.sprite.body.checkCollision.none = false
      if (callback) {
        callback(currPlayer)
      } else {
        currPlayer.setState(States.IDLE)
      }
    })
  }

  launchBallTowardsHoop(currPlayer: CourtPlayer, team: Team) {
    const ball = Game.instance.ball
    ball.show()

    const distance = Phaser.Math.Distance.Between(
      currPlayer.sprite.x,
      currPlayer.sprite.y,
      Game.instance.hoop.rimSprite.x,
      Game.instance.hoop.rimSprite.y
    )

    let arcTime = 1.5
    if (distance < 150) {
      arcTime = 1
    } else if (distance >= 150 && distance < 200) {
      arcTime = 1.2
    } else if (distance > 200) {
      arcTime = 1.5
    }

    const percentageSuccess = this.calculateShotSuccessPercentage(currPlayer, team)
    const isMiss = Phaser.Math.Between(0, 100) > percentageSuccess
    let posToLandX = Game.instance.hoop.rimSprite.x
    if (isMiss) {
      ball.ballState = BallState.MISSED_SHOT
      const missOffset = Phaser.Math.Between(0, 1) ? -10 : 10
      posToLandX = Game.instance.hoop.rimSprite.x + missOffset
    } else {
      ball.ballState = BallState.MADE_SHOT
    }
    createArc(
      ball.sprite,
      {
        x: posToLandX,
        y: Game.instance.hoop.rimSprite.y - 20,
      },
      arcTime
    )
  }

  calculateShotSuccessPercentage(currPlayer: CourtPlayer, team: Team) {
    const shotContesters = team.getOtherTeamCourtPlayers().filter((p) => {
      return p.getCurrState().key === States.CONTEST_SHOT
    })
    const closestContester = getClosestPlayer(currPlayer, shotContesters)

    if (closestContester) {
      const distToClosestContester = Phaser.Math.Distance.Between(
        currPlayer.sprite.x,
        currPlayer.sprite.y,
        closestContester.sprite.x,
        closestContester.sprite.y
      )
      if (distToClosestContester > 100) {
        console.log('Wide open!')
        return 75
      }
      if (distToClosestContester <= 100 && distToClosestContester > 80) {
        console.log('Open')
        return 50
      }
      if (distToClosestContester <= 80 && distToClosestContester > 65) {
        console.log('Contested')
        return 30
      }
      console.log('Smothered')
      return 5
    } else {
      console.log('Wide Open!')
      return 80
    }
  }
}
