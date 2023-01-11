import { getClosestPlayer, getMostOpenPassRecipient } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { DribbleToPointStateConfig } from '~/core/states/offense/DribbleToPointState'
import { PassConfig } from '~/core/states/offense/PassingState'
import { ScreenDirection, SetScreenStateConfig } from '~/core/states/offense/SetScreenState'
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
            onDriveSuccess: () => {},
            onDriveFailed: () => {
              const shouldPass = Phaser.Math.Between(0, 1) == 0
              if (shouldPass) {
                this.passOut(ballHandler)
              } else {
                this.goBackToSpot(ballHandler)
              }
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

  passOut(player: CourtPlayer) {
    const teammates = this.team.getCourtPlayers().filter((p) => {
      return p !== player
    })
    const passRecipient = getMostOpenPassRecipient(teammates, this.team)
    const passConfig: PassConfig = {
      onPassCompleteCb: () => {
        player.setState(States.GO_BACK_TO_SPOT, () => {
          this.reset()
        })
      },
      onPassStartedCb: () => {
        player.stop()
      },
    }
    player.setState(States.PASSING, passRecipient, passConfig)
  }

  goBackToSpot(player: CourtPlayer) {
    player.setState(States.GO_BACK_TO_SPOT, () => {
      this.reset()
    })
  }
}
