import { calculateShotSuccessPercentage, getMostOpenPassRecipient } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { DribbleToPointStateConfig } from '~/core/states/offense/DribbleToPointState'
import { PassConfig } from '~/core/states/offense/PassingState'
import { ShotCoverage } from '~/core/states/offense/ShootingState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { OffensePlay } from './OffensePlay'
import { PlayTypes } from './PlayTypes'

export class FreeStyle extends OffensePlay {
  public endedFreestyle: boolean = false
  public event!: Phaser.Time.TimerEvent

  constructor(team: Team) {
    super(team, PlayTypes.FREESTYLE)
  }

  reset() {
    this.endedFreestyle = false
    super.reset()
  }

  public execute(): void {
    if (!this.isRunning) {
      this.isRunning = true
      this.event = Game.instance.time.addEvent({
        repeat: -1,
        callback: () => {
          const nonBallHandlers = this.team.getCourtPlayers().filter((courtPlayer: CourtPlayer) => {
            return !courtPlayer.hasPossession
          })
          nonBallHandlers.forEach((courtPlayer: CourtPlayer) => {
            this.performRandomOffballAction(courtPlayer)
          })
          const ballHandler = Game.instance.ball.playerWithBall
          if (ballHandler) {
            this.performRandomOnBallAction(ballHandler)
          }
        },
        delay: 1500,
        startAt: 1500,
      })
      Game.instance.time.delayedCall(10000, () => {
        this.stopPlay()
      })
    }
  }

  stopPlay() {
    this.event.paused = true
    this.event.destroy()
    this.endedFreestyle = true
  }

  performRandomOnBallAction(player: CourtPlayer) {
    const isThreePointShot = Game.instance.court.isThreePointShot(player.x, player.y)
    const shotOpenness = calculateShotSuccessPercentage(player, this.team, isThreePointShot)
    if (shotOpenness.coverage === ShotCoverage.WIDE_OPEN) {
      player.setState(States.SHOOTING, () => {
        player.setState(States.IDLE)
        this.stopPlay()
      })
    } else {
      const nonBallHandlers = this.team.getCourtPlayers().filter((courtPlayer: CourtPlayer) => {
        return !courtPlayer.hasPossession
      })
      const randomPassRecipient = getMostOpenPassRecipient(nonBallHandlers, this.team)
      const passConfig: PassConfig = {
        onPassCompleteCb: () => {
          player.setState(States.IDLE)
        },
        onPassStartedCb: () => {},
      }
      if (randomPassRecipient) {
        player.setState(States.PASSING, randomPassRecipient, passConfig)
      }
    }
  }

  performRandomOffballAction(player: CourtPlayer) {
    if (this.endedFreestyle) {
      return
    }
    const randomPoint = Game.instance.court.getRandomPointOnCourt()
    const dribbleToPointConfig: DribbleToPointStateConfig = {
      onReachedPointCB: () => {
        player.setState(States.IDLE)
      },
      failedToReachPointCB: () => {},
      timeout: 5000,
      point: randomPoint,
    }
    player.setState(States.DRIBBLE_TO_POINT, dribbleToPointConfig)
  }
}
