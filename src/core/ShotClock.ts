import Game from '~/scenes/Game'
import { BallState } from './Ball'
import { SORT_ORDER, WINDOW_WIDTH } from './Constants'

export class ShotClock {
  private game: Game
  private shotClockText: Phaser.GameObjects.Text
  private shotTimeSeconds: number = 10
  private timerEvent: Phaser.Time.TimerEvent

  constructor(game: Game) {
    this.game = game
    this.shotClockText = this.game.add
      .text(WINDOW_WIDTH - 20, 20, this.shotTimeSeconds.toString(), {
        color: 'white',
        fontSize: '14px',
      })
      .setDepth(SORT_ORDER.ui)
    this.shotClockText.setPosition(WINDOW_WIDTH - this.shotClockText.displayWidth - 20, 20)
    this.timerEvent = this.game.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.shotTimeSeconds === 0) {
          if (!this.isBallInFlight()) {
            this.timerEvent.paused = true
            this.game.handleChangePossession(this.game.ball.playerWithBall!.side)
          }
        } else {
          this.shotTimeSeconds--
          this.shotClockText.setText(`${this.shotTimeSeconds.toString()}`)
          this.shotClockText.setPosition(WINDOW_WIDTH - this.shotClockText.displayWidth - 20, 20)
        }
      },
    })
  }

  resetShotClockOnNewPossession() {
    this.shotTimeSeconds = 10
    this.shotClockText.setText(`${this.shotTimeSeconds.toString()}`)
    this.shotClockText.setPosition(WINDOW_WIDTH - this.shotClockText.displayWidth - 20, 20)
    this.timerEvent.paused = false
  }

  reboundShotClockReset() {
    this.shotTimeSeconds = 14
  }

  isBallInFlight() {
    const ballState = this.game.ball.ballState
    return (
      ballState === BallState.MADE_TWO_POINT_SHOT ||
      ballState === BallState.MADE_THREE_POINT_SHOT ||
      ballState === BallState.DUNK ||
      ballState === BallState.MISSED_SHOT ||
      ballState === BallState.POST_MADE_SHOT ||
      this.game.ball.isRebounding
    )
  }
}
