import { getClosestPlayer } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { DribbleToPointStateConfig } from '~/core/states/offense/DribbleToPointState'
import { ScreenDirection, SetScreenStateConfig } from '~/core/states/offense/SetScreenState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { OffensePlay } from './OffensePlay'

export class PickAndRoll extends OffensePlay {
  public isDrivingAroundScreen: boolean = false

  constructor(team: Team) {
    super(team)
  }

  reset() {
    this.isDrivingAroundScreen = false
    this.isRunning = false
    super.terminate()
  }

  public execute(): void {
    if (!this.isRunning) {
      this.isRunning = true
      Game.instance.time.delayedCall(1500, () => {
        this.callForScreen()
      })
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
          if (!this.isDrivingAroundScreen) {
            this.reset()
          }
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
          const driveToBasketConfig = {
            onDriveSuccess: () => {
              this.reset()
            },
            onDriveFailed: () => {
              ballHandler.setState(States.GO_BACK_TO_SPOT, () => {
                this.reset()
              })
            },
            timeout: 4000,
          }
          ballHandler.setState(States.DRIVE_TO_BASKET, driveToBasketConfig)
        },
        failedToReachPointCB: () => {
          this.reset()
        },
        point,
      }
      ballHandler.setState(States.DRIBBLE_TO_POINT, config)
    }
  }
}
