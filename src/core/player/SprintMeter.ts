import Game from '~/scenes/Game'
import { COURT_PLAYER_SPEED, COURT_PLAYER_SPRINT_SPEED } from '../Constants'

export class SprintMeter {
  private game: Game
  private detectSprintEvent: Phaser.Time.TimerEvent
  private keyShift: Phaser.Input.Keyboard.Key
  private sprintDuration = 0
  public isSprinting: boolean = false

  constructor(game: Game) {
    this.game = game
    this.keyShift = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

    this.detectSprintEvent = this.game.time.addEvent({
      repeat: -1,
      delay: 1,
      callback: () => {
        if (this.keyShift.isDown) {
          this.isSprinting = true
          this.sprintDuration = Math.min(100, this.sprintDuration + 2)
        } else {
          this.isSprinting = false
          this.sprintDuration = Math.max(0, this.sprintDuration - 1)
        }
      },
    })
  }

  public getSpeed() {
    // return 50
    if (this.isSprinting) {
      if (this.sprintDuration >= 25 && this.sprintDuration < 75) {
        return COURT_PLAYER_SPRINT_SPEED
      }
      if (this.sprintDuration >= 75) {
        return COURT_PLAYER_SPEED
      }
      return COURT_PLAYER_SPEED
    } else {
      return COURT_PLAYER_SPEED
    }
  }
}
