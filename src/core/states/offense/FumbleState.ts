import { Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class FumbleState extends State {
  private isFumbling: boolean = false

  enter(currPlayer: CourtPlayer, team: Team, prevState: States) {
    if (!this.isFumbling) {
      this.isFumbling = true
      currPlayer.sprite.anims.stop()
      currPlayer.sprite.setVelocity(0, 0)
      currPlayer.sprite.setGravity(0)
      const suffix = team.side === Side.CPU ? 'cpu' : 'player'
      currPlayer.sprite.setTexture(`fumble-${suffix}-start`)
    }
  }

  exit() {
    this.isFumbling = false
  }
}
