import Game from '~/scenes/Game'
import { DEFAULT_FONT, Side } from './Constants'

export class ScoreTracker {
  private playerScoreText!: Phaser.GameObjects.Text
  private cpuScoreText!: Phaser.GameObjects.Text
  public playerScore: number = 0
  public cpuScore: number = 0

  private game: Game

  constructor(game: Game) {
    this.game = game
    this.initializeText()
  }

  initializeText() {
    this.playerScoreText = this.game.add.text(0, 0, `Player: ${this.playerScore}`).setStyle({
      fontSize: '20px',
      color: 'white',
      fontFamily: DEFAULT_FONT,
    })
    this.cpuScoreText = this.game.add.text(0, 0, `CPU: ${this.cpuScore}`).setStyle({
      fontSize: '20px',
      color: 'white',
      fontFamily: DEFAULT_FONT,
    })

    this.playerScoreText.setPosition(20, 20)
    this.cpuScoreText.setPosition(this.playerScoreText.displayWidth + 50, 20)
  }

  increaseScore(numPoints: number, side: Side) {
    if (side === Side.PLAYER) {
      this.playerScore += numPoints
      this.playerScoreText.setText(`Player: ${this.playerScore}`)
    } else {
      this.cpuScore += numPoints
      this.cpuScoreText.setText(`CPU: ${this.cpuScore}`)
    }
    this.playerScoreText.setPosition(20, 20)
    this.cpuScoreText.setPosition(this.playerScoreText.displayWidth + 50, 20)
  }
}
