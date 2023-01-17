import Game from '~/scenes/Game'
import { CourtPlayer } from '../CourtPlayer'
import { Team } from '../Team'
import { State } from './StateMachine'

export class ChaseReboundState extends State {
  execute(currPlayer: CourtPlayer, team: Team) {
    const ball = Game.instance.ball
    currPlayer.moveTowards(
      {
        x: ball.sprite.x,
        y: ball.sprite.y,
      },
      currPlayer.getDefSpeedFromAttr()
    )
  }
}
