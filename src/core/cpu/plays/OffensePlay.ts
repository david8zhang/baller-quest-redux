import { calculateShotSuccessPercentage, getMostOpenPassRecipient } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { PassConfig } from '~/core/states/offense/PassingState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { CPUTeam } from '../CPUTeam'
import { PlayTypes } from './PlayTypes'

export abstract class OffensePlay {
  protected team: Team
  public isRunning: boolean = false
  public playType: PlayTypes
  public isPlayFinished: boolean = false

  constructor(team: Team, playType: PlayTypes) {
    this.team = team
    this.playType = playType
  }

  public abstract execute(): void

  public reset() {
    this.isPlayFinished = false
    this.isRunning = false
    const courtPlayers = this.team.getCourtPlayers()
    courtPlayers.forEach((p) => {
      p.setState(States.IDLE)
    })
    const cpuTeam = this.team as CPUTeam
    cpuTeam.selectNextPlay()
  }

  shouldShoot(receiver) {
    const otherPlayers = this.team.getOtherTeamCourtPlayers()
    let minDistance = Number.MAX_SAFE_INTEGER
    otherPlayers.forEach((player: CourtPlayer) => {
      const distance = Phaser.Math.Distance.Between(
        player.sprite.x,
        player.sprite.y,
        receiver.sprite.x,
        receiver.sprite.y
      )
      minDistance = Math.min(distance, minDistance)
    })
    return minDistance >= 125
  }

  shootOrDrive(receiver: CourtPlayer) {
    if (this.shouldShoot(receiver)) {
      this.shoot(receiver)
    } else {
      this.driveToBasket(receiver)
    }
  }

  canInterruptPlay() {
    const ballHandler = Game.instance.ball.playerWithBall
    if (ballHandler && ballHandler.side === this.team.side) {
      const currStateKey = ballHandler.getCurrState().key
      return !(
        currStateKey === States.SHOOTING ||
        currStateKey === States.LAYUP ||
        currStateKey == States.DUNK ||
        currStateKey == States.PASSING
      )
    }
    return false
  }

  interruptPlay() {
    this.isPlayFinished = true
    this.team.getCourtPlayers().forEach((player: CourtPlayer) => {
      player.setState(States.IDLE)
    })
  }

  shouldLayup(receiver: CourtPlayer) {
    const shouldLayupThroughContact = Phaser.Math.Between(0, 100) > 70
    return shouldLayupThroughContact || receiver.canLayupBall()
  }

  shouldDunk(receiver: CourtPlayer) {
    const shouldDunkThroughContact = Phaser.Math.Between(0, 100) > 85
    return shouldDunkThroughContact || receiver.canDunkBall()
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
          if (this.shouldShoot(receiver)) {
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
      onPassStartedCb: () => {},
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
