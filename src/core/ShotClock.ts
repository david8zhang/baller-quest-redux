import Game from '~/scenes/Game'
import { BallState } from './Ball'
import { DEFAULT_FONT, SORT_ORDER, WINDOW_WIDTH } from './Constants'

export class ShotClock {
  private static DEFAULT_CLOCK_TIME = 24
  private static OFFENSIVE_REBOUND_CLOCK_TIME = 14

  private game: Game
  private shotClockText: Phaser.GameObjects.Text
  public shotTimeSeconds: number = ShotClock.DEFAULT_CLOCK_TIME
  private timerEvent: Phaser.Time.TimerEvent

  constructor(game: Game) {
    this.game = game
    this.shotClockText = this.game.add
      .text(WINDOW_WIDTH - 20, 20, this.shotTimeSeconds.toString(), {
        color: 'white',
        fontSize: '20px',
        fontFamily: DEFAULT_FONT,
      })
      .setDepth(SORT_ORDER.ui)
    this.shotClockText.setPosition(WINDOW_WIDTH - this.shotClockText.displayWidth - 20, 20)
    this.timerEvent = this.game.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.shotTimeSeconds === 0) {
          if (!this.isBallInFlight() && !this.game.isChangingPossession) {
            this.timerEvent.paused = true
            if (!this.game.ball.playerWithBall) {
              this.game.handleChangePossession(this.game.ball.prevPlayerWithBall!.side)
            } else {
              this.game.handleChangePossession(this.game.ball.playerWithBall.side)
            }
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
    this.shotTimeSeconds = ShotClock.DEFAULT_CLOCK_TIME
    this.shotClockText.setText(`${this.shotTimeSeconds.toString()}`)
    this.shotClockText.setPosition(WINDOW_WIDTH - this.shotClockText.displayWidth - 20, 20)
    this.timerEvent.paused = false
  }

  reboundShotClockReset() {
    this.shotTimeSeconds = ShotClock.OFFENSIVE_REBOUND_CLOCK_TIME
    this.shotClockText.setText(`${this.shotTimeSeconds.toString()}`)
    this.shotClockText.setPosition(WINDOW_WIDTH - this.shotClockText.displayWidth - 20, 20)
    this.timerEvent.paused = false
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
