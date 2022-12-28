import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import { State } from '../StateMachine'

export interface DribbleToPointStateConfig {
  timeout: number
  point: { x: number; y: number }
  onReachedPointCB: Function
  failedToReachPointCB: Function
}

export class DribbleToPointState extends State {
  private startedDribblingTimestamp = -1
  public timeout: number = 0
  public point!: { x: number; y: number }
  public onReachedPointCB: Function | null = null
  public failedToReachPointCB: Function | null = null

  enter(currPlayer: CourtPlayer, team: Team, config: DribbleToPointStateConfig) {
    this.point = config.point
    this.onReachedPointCB = config.onReachedPointCB
    this.failedToReachPointCB = config.failedToReachPointCB
    this.timeout = config.timeout
  }

  execute(currPlayer: CourtPlayer, team: Team) {
    if (this.point) {
      const currTimestamp = Date.now()
      if (currPlayer.isAtPoint(this.point)) {
        if (this.onReachedPointCB) {
          this.onReachedPointCB()
        }
      } else {
        if (this.startedDribblingTimestamp == -1) {
          this.startedDribblingTimestamp = currTimestamp
          currPlayer.moveTowards(this.point)
        } else {
          if (currTimestamp - this.startedDribblingTimestamp >= this.timeout) {
            currPlayer.stop()
            if (this.failedToReachPointCB) {
              this.failedToReachPointCB()
            }
          } else {
            currPlayer.moveTowards(this.point)
          }
        }
      }
    }
  }

  exit() {
    this.startedDribblingTimestamp = -1
  }
}
