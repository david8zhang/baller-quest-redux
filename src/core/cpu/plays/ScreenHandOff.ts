import { getClosestPlayer } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { DribbleToPointStateConfig } from '~/core/states/offense/DribbleToPointState'
import { PassConfig } from '~/core/states/offense/PassingState'
import {
  ScreenDirection,
  SetScreenState,
  SetScreenStateConfig,
} from '~/core/states/offense/SetScreenState'
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
    this.drivingToBasket = false
    this.isRunning = false
    super.terminate()
  }

  public execute(): void {
    if (!this.isRunning) {
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
          this.reset()
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
      x: screenDirection == ScreenDirection.RIGHT ? screener.x + 50 : screener.x - 50,
      y: screener.y + 50,
    }
    const config: DribbleToPointStateConfig = {
      timeout: 5000,
      onReachedPointCB: () => {
        const driveToBasketConfig = {
          onDriveSuccess: () => {},
          onDriveFailed: () => {
            receiver.setState(States.GO_BACK_TO_SPOT, () => {
              this.reset()
            })
          },
          timeout: 4000,
        }
        receiver.setState(States.DRIVE_TO_BASKET, driveToBasketConfig)
      },
      failedToReachPointCB: () => {
        this.reset()
      },
      point,
    }
    receiver.setState(States.DRIBBLE_TO_POINT, config)
  }
}
