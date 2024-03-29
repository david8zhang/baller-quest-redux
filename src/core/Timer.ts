import Game from '~/scenes/Game'
import { DEFAULT_FONT, WINDOW_WIDTH } from './Constants'

export class Timer {
  private game: Game
  public clockText: Phaser.GameObjects.Text
  public static MATCH_TIME = 180
  public currSeconds: number = Timer.MATCH_TIME
  public onMatchFinished: Function | null = null
  public timerEvent: Phaser.Time.TimerEvent

  constructor(game: Game, onMatchFinished: Function) {
    this.game = game
    this.clockText = this.game.add.text(0, 0, this.convertToClockString(this.currSeconds))
    this.clockText.setStyle({
      fontSize: '30px',
      fontFamily: DEFAULT_FONT,
    })
    this.onMatchFinished = onMatchFinished
    this.clockText.setPosition(WINDOW_WIDTH / 2 - this.clockText.width / 2, 20)
    this.timerEvent = this.game.time.addEvent({
      callback: () => {
        this.decrementClock()
      },
      delay: 1000,
      repeat: -1,
    })
  }
  decrementClock() {
    this.currSeconds--
    this.clockText.setText(this.convertToClockString(this.currSeconds))
    if (this.currSeconds === 0) {
      if (Game.instance.ball.isBallInFlight()) {
        this.timerEvent.paused = true
      } else if (this.onMatchFinished) {
        this.onMatchFinished()
      }
    }
  }

  convertToClockString(seconds: number) {
    const numMinutes = Math.floor(seconds / 60)
    const numSeconds = seconds % 60
    return `${numMinutes}:${numSeconds < 10 ? `0${numSeconds}` : numSeconds}`
  }
}
