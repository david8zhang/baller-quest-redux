import {
  calculateShotSuccessPercentage,
  getClosestPlayer,
  getMostOpenPassRecipient,
} from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { DribbleToPointStateConfig } from '~/core/states/offense/DribbleToPointState'
import { PassConfig } from '~/core/states/offense/PassingState'
import {
  ScreenDirection,
  SetScreenState,
  SetScreenStateConfig,
} from '~/core/states/offense/SetScreenState'
import { ShotCoverage } from '~/core/states/offense/ShootingState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { OffensePlay } from './OffensePlay'
import { PlayTypes } from './PlayTypes'

export class ScreenHandOff extends OffensePlay {
  public drivingToBasket: boolean = false

  constructor(team: Team) {
    super(team, PlayTypes.SCREEN_HAND_OFF)
  }

  reset() {
    this.isPlayFinished = false
    this.drivingToBasket = false
    super.reset()
  }

  public execute(): void {
    if (!this.isRunning && !this.isPlayFinished) {
      this.isRunning = true
      this.dribbleAndPassToReceiver()
    }
  }

  dribbleAndPassToReceiver() {
    const ballHandler = Game.instance.ball.playerWithBall
    if (ballHandler) {
      const players = this.team.getCourtPlayers()
      const receiver = getClosestPlayer(ballHandler, players)
      const midPoint = {
        x: (receiver.x + ballHandler.x) / 2,
        y: (receiver.y + ballHandler.y) / 2,
      }

      const ballHandlerConfig: DribbleToPointStateConfig = {
        timeout: 5000,
        onReachedPointCB: () => {
          if (ballHandler.isAtPoint(midPoint) && ballHandler.hasPossession) {
            const passConfig: PassConfig = {
              onPassStartedCb: () => {
                const screenConfig: SetScreenStateConfig = {
                  onScreenFinishedCallback: () => {},
                  isScreeningCallback: () => {
                    if (!this.drivingToBasket) {
                      this.drivingToBasket = true
                      const screenData = ballHandler.getCurrState().data as SetScreenState
                      const screenDirection = screenData.screenDirection
                      this.receiverDribbleAroundScreen(receiver, ballHandler, screenDirection)
                    }
                  },
                }
                ballHandler.setState(States.SET_SCREEN, screenConfig)
              },
              onPassCompleteCb: () => {},
            }
            ballHandler.setState(States.PASSING, receiver, passConfig)
          }
        },
        failedToReachPointCB: () => {
          this.isPlayFinished = true
        },
        point: midPoint,
      }
      ballHandler.setState(States.DRIBBLE_TO_POINT, ballHandlerConfig)
    }
  }

  receiverDribbleAroundScreen(
    receiver: CourtPlayer,
    screener: CourtPlayer,
    screenDirection: ScreenDirection
  ) {
    const point = {
      x: screenDirection == ScreenDirection.RIGHT ? screener.x + 75 : screener.x - 75,
      y: screener.y + 50,
    }
    const config: DribbleToPointStateConfig = {
      timeout: 5000,
      onReachedPointCB: () => {
        this.shootOrDrive(receiver)
      },
      failedToReachPointCB: () => {
        this.isPlayFinished = true
      },
      point,
    }
    receiver.setState(States.DRIBBLE_TO_POINT, config)
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

  shouldLayup(receiver: CourtPlayer) {
    const shouldLayupThroughContact = Phaser.Math.Between(0, 100) > 50
    return shouldLayupThroughContact || receiver.canLayupBall()
  }

  shoot(receiver: CourtPlayer) {
    receiver.setState(States.SHOOTING, () => {
      receiver.setState(States.IDLE)
      this.isPlayFinished = true
    })
  }

  driveToBasket(receiver: CourtPlayer) {
    const driveToBasketConfig = {
      onDriveSuccess: () => {
        if (this.shouldLayup(receiver)) {
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
