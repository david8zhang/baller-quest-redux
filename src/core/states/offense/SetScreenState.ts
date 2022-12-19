import { CourtPlayer } from '~/core/CourtPlayer'
import { CourtPlayerAI } from '~/core/CourtPlayerAI'
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

  execute(currPlayer: CourtPlayerAI, team: Team) {
    if (this.startedScreenTimestamp != -1) {
      const currTimestamp = Date.now()
      if (currTimestamp - this.startedScreenTimestamp > SetScreenState.SCREEN_DURATION) {
        currPlayer.setState(States.IDLE)
        this.startedScreenTimestamp = -1
      }
    } else {
      const ballHandler = Game.instance.ball.playerWithBall
      if (ballHandler) {
        this.startedScreenTimestamp = Date.now()
        const currCourtPlayer = currPlayer.courtPlayer
        const direction =
          currCourtPlayer.sprite.x >= ballHandler?.sprite.x
            ? ScreenDirection.RIGHT
            : ScreenDirection.LEFT
        const defenderForBallHandler = team.getDefenderForPlayer(ballHandler)
        if (defenderForBallHandler) {
          const screenPosition = {
            x:
              direction === ScreenDirection.RIGHT
                ? defenderForBallHandler.sprite.x + 20
                : defenderForBallHandler.sprite.x - 20,
            y: defenderForBallHandler.sprite.y,
          }
          currCourtPlayer.moveTowards(screenPosition)
        }
      }
    }
  }
}
