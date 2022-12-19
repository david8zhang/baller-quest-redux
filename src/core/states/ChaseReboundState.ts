import Game from '~/scenes/Game'
import { CourtPlayer } from '../CourtPlayer'
import { CourtPlayerAI } from '../CourtPlayerAI'
import { Team } from '../Team'
import { State } from './StateMachine'

export class ChaseReboundState extends State {
  execute(currPlayer: CourtPlayerAI, team: Team) {
    const ball = Game.instance.ball
    currPlayer.courtPlayer.moveTowards({
      x: ball.sprite.x,
      y: ball.sprite.y,
    })
  }
}
