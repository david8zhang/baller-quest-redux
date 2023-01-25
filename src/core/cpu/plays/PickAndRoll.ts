import {
  calculateShotSuccessPercentage,
  getClosestPlayer,
  getMostOpenPassRecipient,
} from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { DribbleToPointStateConfig } from '~/core/states/offense/DribbleToPointState'
import { PassConfig } from '~/core/states/offense/PassingState'
import { ScreenDirection, SetScreenStateConfig } from '~/core/states/offense/SetScreenState'
import { ShotCoverage } from '~/core/states/offense/ShootingState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { OffensePlay } from './OffensePlay'
import { PlayTypes } from './PlayTypes'

export class PickAndRoll extends OffensePlay {
  public isDrivingAroundScreen: boolean = false

  constructor(team: Team) {
    super(team, PlayTypes.PICK_AND_ROLL)
  }

  reset() {
    this.isDrivingAroundScreen = false
    super.reset()
  }

  public execute(): void {
    if (!this.isRunning && !this.isPlayFinished) {
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
          if (!this.isDrivingAroundScreen) {
            this.isPlayFinished = true
          }
          this.driveToBasket(screener)
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
        x: screenDirection == ScreenDirection.RIGHT ? screener.x + 75 : screener.x - 75,
        y: screener.y + 50,
      }
      const config: DribbleToPointStateConfig = {
        timeout: 5000,
        onReachedPointCB: () => {
          this.shootOrDrive(ballHandler)
        },
        failedToReachPointCB: () => {
          this.isPlayFinished = true
        },
        point,
      }
      ballHandler.setState(States.DRIBBLE_TO_POINT, config)
    }
  }
}
