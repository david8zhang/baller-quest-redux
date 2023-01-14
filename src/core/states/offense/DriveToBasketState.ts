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
  private startedTimestamp: number = -1
  private onDriveSuccess!: Function
  private onDriveFailed!: Function
  private timeout!: number

  enter(currPlayer: CourtPlayer, team: Team, config: DriveToBasketConfig) {
    this.onDriveSuccess = config.onDriveSuccess
    this.onDriveFailed = config.onDriveFailed
    this.timeout = config.timeout
  }

  execute(currPlayer: CourtPlayer, team: Team) {
    const currTimestamp = Date.now()
    if (this.startedTimestamp === -1) {
      this.startedTimestamp = currTimestamp
    } else {
      if (currTimestamp - this.startedTimestamp >= this.timeout) {
        this.startedTimestamp = -1
        this.onDriveFailed()
      } else {
        const hoop = Game.instance.hoop.standSprite
        const distToHoop = Phaser.Math.Distance.Between(hoop.x, hoop.y, currPlayer.x, currPlayer.y)
        if (distToHoop <= LAYUP_DISTANCE) {
          this.startedTimestamp = -1
          this.onDriveSuccess()
        } else {
          currPlayer.moveTowards(
            {
              x: hoop.x,
              y: hoop.y,
            },
            currPlayer.getOffSpeedFromAttr()
          )
        }
      }
    }
  }
}
