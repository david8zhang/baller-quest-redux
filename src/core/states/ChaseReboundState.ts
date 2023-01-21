import Game from '~/scenes/Game'
import { CourtPlayer } from '../CourtPlayer'
import { Team } from '../Team'
import { State } from './StateMachine'

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

  exit() {
    this.isJumping = false
  }
}
