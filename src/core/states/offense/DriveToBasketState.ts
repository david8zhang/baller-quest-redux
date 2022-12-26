import { LAYUP_DISTANCE } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export interface DriveToBasketConfig {
  timeout: number
  onDriveSuccess: Function
  onDriveFailed: Function
}

export class DriveToBasketState extends State {
  enter(currPlayer: CourtPlayer, team: Team) {}

  execute(currPlayer: CourtPlayer, team: Team) {
    const hoop = Game.instance.hoop.standSprite
    const distToHoop = Phaser.Math.Distance.Between(hoop.x, hoop.y, currPlayer.x, currPlayer.y)
    if (distToHoop <= LAYUP_DISTANCE) {
      if (currPlayer.canLayupBall()) {
        currPlayer.setState(States.LAYUP)
      } else {
        currPlayer.setState(States.SHOOTING)
      }
    } else {
      currPlayer.moveTowards({
        x: hoop.x,
        y: hoop.y,
      })
    }
  }
}
