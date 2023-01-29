import { Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export class FallState extends State {
  public isFalling: boolean = false
  enter(currPlayer: CourtPlayer, team: Team) {
    if (!this.isFalling) {
      this.isFalling = true
      currPlayer.sprite.anims.stop()
      currPlayer.sprite.setVelocity(0, 0)
      currPlayer.sprite.setGravity(0)
      const suffix = team.side === Side.CPU ? 'cpu' : 'player'
      currPlayer.sprite.setTexture(`fumble-${suffix}-start`)
      Game.instance.time.delayedCall(200, () => {
        currPlayer.sprite.setTexture(`fumble-${suffix}-fall`)
        Game.instance.time.delayedCall(150, () => {
          currPlayer.sprite.setTexture(`fumble-${suffix}-end`)
          Game.instance.time.delayedCall(300, () => {
            currPlayer.sprite.setTexture(`fumble-${suffix}-fall`)
            Game.instance.time.delayedCall(150, () => {
              currPlayer.sprite.setTexture(`fumble-${suffix}-start`)
            })
          })
        })
      })
    }
  }

  exit() {
    this.isFalling = false
  }
}
