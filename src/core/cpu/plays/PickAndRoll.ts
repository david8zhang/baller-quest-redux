import { getClosestPlayer } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { DribbleToPointStateConfig } from '~/core/states/offense/DribbleToPointState'
import { ScreenDirection, SetScreenStateConfig } from '~/core/states/offense/SetScreenState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import { OffensePlay } from './OffensePlay'

export class PickAndRoll extends OffensePlay {
  public isDrivingAroundScreen: boolean = false

  constructor(team: Team) {
    super(team)
  }

  public execute(): void {
    if (!this.isRunning) {
      this.isRunning = true
      this.callForScreen()
    }
  }

  public callForScreen() {
    const allTeamPlayers = this.team.getCourtPlayers()
    const ballHandler = allTeamPlayers.find((p) => p.hasPossession)
    if (ballHandler) {
      // Call for a screen
      const screener = getClosestPlayer(ballHandler, allTeamPlayers)
      const setScreenConfig: SetScreenStateConfig = {
        onScreenFinishedCallback: () => {
          this.terminate()
        },
        isScreeningCallback: () => {
          this.driveAroundScreen(screener, ballHandler)
        },
      }
      screener.setState(States.SET_SCREEN, setScreenConfig)
    }
  }

  public driveAroundScreen(screener: CourtPlayer, ballHandler: CourtPlayer) {
    if (!this.isDrivingAroundScreen) {
      this.isDrivingAroundScreen = true
      const screenDirection =
        screener.x > ballHandler.x ? ScreenDirection.RIGHT : ScreenDirection.LEFT
      const point = {
        x: screenDirection == ScreenDirection.RIGHT ? screener.x + 50 : screener.x - 50,
        y: screener.y + 50,
      }
      const config: DribbleToPointStateConfig = {
        timeout: 5000,
        onReachedPointCB: () => {
          ballHandler.setState(States.DRIVE_TO_BASKET)
        },
        failedToReachPointCB: () => {
          this.terminate()
        },
        point,
      }
      ballHandler.setState(States.DRIBBLE_TO_POINT, config)
    }
  }
}
