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

  shootOrDrive(receiver: CourtPlayer) {
    const isThreePointShot = Game.instance.court.isThreePointShot(
      receiver.sprite.x,
      receiver.sprite.y
    )
    const shotSuccessData = calculateShotSuccessPercentage(
      receiver,
      this.team,
      isThreePointShot,
      false
    )
    if (shotSuccessData.coverage === ShotCoverage.WIDE_OPEN) {
      this.shoot(receiver)
    } else {
      this.driveToBasket(receiver)
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
          // this.shootOrDrive(ballHandler)
          this.driveToBasket(ballHandler)
        },
        failedToReachPointCB: () => {
          this.isPlayFinished = true
        },
        point,
      }
      ballHandler.setState(States.DRIBBLE_TO_POINT, config)
    }
  }

  shoot(ballHandler: CourtPlayer) {
    ballHandler.setState(States.SHOOTING, () => {
      ballHandler.setState(States.IDLE)
      this.isPlayFinished = true
    })
  }

  shouldLayup(receiver: CourtPlayer) {
    const shouldLayupThroughContact = Phaser.Math.Between(0, 100) > 50
    return shouldLayupThroughContact || receiver.canLayupBall()
  }

  shouldDunk(receiver: CourtPlayer) {
    const shouldDunkThroughContact = Phaser.Math.Between(0, 100) > 15
    return shouldDunkThroughContact || receiver.canDunkBall()
  }

  driveToBasket(receiver: CourtPlayer) {
    const driveToBasketConfig = {
      onDriveSuccess: () => {
        if (this.shouldDunk(receiver)) {
          receiver.setState(States.DUNK, () => {
            receiver.setState(States.IDLE)
            this.isPlayFinished = true
          })
        } else if (this.shouldLayup(receiver)) {
          receiver.setState(States.LAYUP, () => {
            receiver.setState(States.IDLE)
            this.isPlayFinished = true
          })
        } else {
          const shotSuccessData = calculateShotSuccessPercentage(receiver, this.team, false, false)
          if (shotSuccessData.coverage === ShotCoverage.WIDE_OPEN) {
            receiver.setState(States.SHOOTING, () => {
              receiver.setState(States.IDLE)
              this.isPlayFinished = true
            })
          } else {
            this.handleDriveFailed(receiver)
          }
        }
      },
      onDriveFailed: () => {
        this.handleDriveFailed(receiver)
      },
      timeout: 4000,
    }
    receiver.setState(States.DRIVE_TO_BASKET, driveToBasketConfig)
  }

  handleDriveFailed(ballHandler: CourtPlayer) {
    const shouldPass = Phaser.Math.Between(0, 1) == 0
    if (shouldPass) {
      this.passOut(ballHandler)
    } else {
      this.goBackToSpot(ballHandler)
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
          this.isPlayFinished = true
        })
      },
      onPassStartedCb: () => {
        player.stop()
      },
    }
    if (passRecipient) {
      player.setState(States.PASSING, passRecipient, passConfig)
    } else {
      this.goBackToSpot(player)
    }
  }

  goBackToSpot(player: CourtPlayer) {
    player.setState(States.GO_BACK_TO_SPOT, () => {
      this.isPlayFinished = true
    })
  }
}
