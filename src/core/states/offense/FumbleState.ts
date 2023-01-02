import { Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class FumbleState extends State {
  enter(currPlayer: CourtPlayer, team: Team, prevState: States) {
    currPlayer.sprite.setTintFill(0x0000ff)
    Game.instance.time.delayedCall(300, () => {
      if (team.side === Side.CPU) {
        currPlayer.sprite.setTintFill(0xff0000)
      } else {
        currPlayer.sprite.clearTint()
      }
      currPlayer.setState(prevState)
    })
  }
}
