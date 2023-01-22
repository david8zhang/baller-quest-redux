import Game from '~/scenes/Game'
import { createArc, Side, SORT_ORDER } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { Team } from '../Team'
import { State } from './StateMachine'
import { States } from './States'

export class ChaseReboundState extends State {
  public isJumping: boolean = false

  execute(currPlayer: CourtPlayer, team: Team) {
    const ball = Game.instance.ball
    let yPos = ball.sprite.y
    if (ball.sprite.y <= Game.instance.court.behindBackboardWallSprite.y) {
      yPos = Game.instance.court.behindBackboardWallSprite.y
    }
    currPlayer.moveTowards(
      {
        x: ball.sprite.x,
        y: yPos,
      },
      currPlayer.getDefSpeedFromAttr()
    )
  }

  shouldJumpForRebound(currPlayer: CourtPlayer) {
    const ball = Game.instance.ball
    const distance = Phaser.Math.Distance.Between(
      currPlayer.sprite.x,
      currPlayer.sprite.y,
      ball.sprite.x,
      ball.sprite.y
    )
    const xDiff = Math.abs(ball.sprite.x - currPlayer.sprite.x)
    const yDiff = currPlayer.sprite.y - ball.sprite.y
    return xDiff < 30 && yDiff > 64 && distance <= 100 && !this.isJumping && ball.reboundPoint
  }

  jumpForRebound(currPlayer: CourtPlayer) {
    currPlayer.stop()
    currPlayer.sprite.body.checkCollision.none = true
    this.isJumping = true
    const jumpDuration = 0.6

    const isToRight = currPlayer.sprite.x < Game.instance.ball.sprite.x

    const pointToJumpTo = {
      x: isToRight ? currPlayer.sprite.x + 32 : currPlayer.sprite.x - 32,
      y: currPlayer.sprite.y,
    }
    Game.instance.add
      .circle(pointToJumpTo.x, pointToJumpTo.y, 5, 0xff0000)
      .setDepth(SORT_ORDER.ui + 1000)
      .setName('ui')

    createArc(currPlayer.sprite, pointToJumpTo, jumpDuration)

    Game.instance.time.delayedCall(100 * jumpDuration, () => {
      currPlayer.sprite.body.checkCollision.none = false
    })

    Game.instance.time.delayedCall(975 * jumpDuration, () => {
      this.isJumping = false
      currPlayer.setVelocity(0, 0)
      currPlayer.sprite.setGravity(0)

      if (currPlayer.hasPossession) {
        const newState = currPlayer.side === Side.PLAYER ? States.PLAYER_CONTROL : States.IDLE
        currPlayer.setState(newState)
      }
    })
  }

  exit() {
    this.isJumping = false
  }
}
