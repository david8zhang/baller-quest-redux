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

export class IsoDribble extends OffensePlay {
  constructor(team: Team) {
    super(team, PlayTypes.ISO_DRIBBLE)
  }

  public execute(): void {
    if (!this.isRunning) {
      this.isRunning = true

      const ballHandler = Game.instance.ball.playerWithBall
      if (ballHandler) {
        const defender = this.team.getDefenderForPlayer(ballHandler)
        if (defender) {
          const defenderLeft = {
            x: defender.sprite.x - 50,
            y: ballHandler.y,
          }
          const defenderRight = {
            x: defender.sprite.x + 50,
            y: ballHandler.y,
          }
          const dribblePoint = Phaser.Math.Between(0, 1) === 0 ? defenderLeft : defenderRight
          const dribbleToPointConfig: DribbleToPointStateConfig = {
            point: dribblePoint,
            onReachedPointCB: () => {
              this.shootOrDrive(ballHandler)
            },
            failedToReachPointCB: () => {
              this.isPlayFinished = true
            },
            timeout: 3000,
            speedMultiplier: 1.25,
          }
          ballHandler.setState(States.DRIBBLE_TO_POINT, dribbleToPointConfig)
        }
      }
    }
  }
}
