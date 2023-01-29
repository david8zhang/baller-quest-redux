import Game from '~/scenes/Game'
import { COURT_PLAYER_SPEED, COURT_PLAYER_SPRINT_SPEED } from '../Constants'
import { Team } from '../Team'
import { PlayerTeam } from './PlayerTeam'

export class SprintMeter {
  private game: Game
  private detectSprintEvent: Phaser.Time.TimerEvent
  private keyShift: Phaser.Input.Keyboard.Key
  private sprintDuration = 0
  public isSprinting: boolean = false
  public team: PlayerTeam

  constructor(game: Game, team: PlayerTeam) {
    this.team = team
    this.game = game
    this.keyShift = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

    this.detectSprintEvent = this.game.time.addEvent({
      repeat: -1,
      delay: 1,
      callback: () => {
        if (this.keyShift.isDown && !this.team.isDribbling) {
          this.isSprinting = true
          this.sprintDuration = Math.min(250, this.sprintDuration + 2)
        } else {
          this.isSprinting = false
          this.sprintDuration = Math.max(0, this.sprintDuration - 1)
        }
      },
    })
  }

  public getSpeedMultiplier() {
    if (this.isSprinting) {
      if (this.sprintDuration >= 25 && this.sprintDuration < 75) {
        return 1.5
      }
      if (this.sprintDuration >= 75 && this.sprintDuration < 150) {
        return 1.25
      }
      if (this.sprintDuration >= 150 && this.sprintDuration < 200) {
        return 0.85
      }
      if (this.sprintDuration > 200) {
        return 0.75
      }
      return 1
    } else {
      return 1
    }
  }
}
