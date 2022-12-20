import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export enum ScreenDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export class SetScreenState extends State {
  public startedScreenTimestamp = -1
  public static SCREEN_DURATION = 5000
  public onScreenFinishedCallback: Function | null = null
  public screenPosition!: { x: number; y: number }

  enter(currPlayer: CourtPlayer, team: Team, cb: Function) {
    if (cb) {
      this.onScreenFinishedCallback = cb
    }
  }

  execute(currPlayer: CourtPlayer, team: Team, callback?: Function) {
    if (this.startedScreenTimestamp != -1) {
      const currTimestamp = Date.now()
      if (currPlayer.isAtPoint(this.screenPosition)) {
        if (currTimestamp - this.startedScreenTimestamp > SetScreenState.SCREEN_DURATION) {
          currPlayer.setState(States.GO_BACK_TO_SPOT, this.onScreenFinishedCallback)
          this.startedScreenTimestamp = -1
        } else {
          currPlayer.stop()
        }
      }
    } else {
      const ballHandler = Game.instance.ball.playerWithBall
      if (ballHandler) {
        this.startedScreenTimestamp = Date.now()
        const direction =
          currPlayer.sprite.x >= ballHandler?.sprite.x
            ? ScreenDirection.RIGHT
            : ScreenDirection.LEFT
        const defenderForBallHandler = team.getDefenderForPlayer(ballHandler)
        if (defenderForBallHandler) {
          const screenPosition = {
            x:
              direction === ScreenDirection.RIGHT
                ? defenderForBallHandler.sprite.x + 40
                : defenderForBallHandler.sprite.x - 40,
            y: defenderForBallHandler.sprite.y + 5,
          }
          this.screenPosition = screenPosition
          currPlayer.moveTowards(screenPosition)
        }
      }
    }
  }
}
