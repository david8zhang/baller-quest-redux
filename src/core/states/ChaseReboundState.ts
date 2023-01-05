import Game from '~/scenes/Game'
import { Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { Team } from '../Team'
import { State } from './StateMachine'

export class ChaseReboundState extends State {
  execute(currPlayer: CourtPlayer, team: Team) {
    if (team.side !== Side.PLAYER) {
      const ball = Game.instance.ball
      currPlayer.moveTowards({
        x: ball.sprite.x,
        y: ball.sprite.y,
      })
    }
  }
}
