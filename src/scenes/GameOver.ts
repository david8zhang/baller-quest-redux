import { DEFAULT_FONT, WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { button } from '~/ui/Button'

export enum WinConditions {
  CPU_WIN = 'CPU_WIN',
  PLAYER_WIN = 'PLAYER_WIN',
  TIE = 'TIE',
}

export class GameOver extends Phaser.Scene {
  public winCondition!: WinConditions
  public playerScore: number = 0
  public cpuScore: number = 0

  constructor() {
    super('gameover')
  }

  init(data: { playerScore: number; cpuScore: number }) {
    if (data.playerScore > data.cpuScore) {
      this.winCondition = WinConditions.PLAYER_WIN
    } else if (data.playerScore < data.cpuScore) {
      this.winCondition = WinConditions.CPU_WIN
    } else {
      this.winCondition = WinConditions.TIE
    }
    this.playerScore = data.playerScore
    this.cpuScore = data.cpuScore
  }

  create() {
    const winText = this.add.text(0, 0, '', {
      fontSize: '40px',
      fontFamily: DEFAULT_FONT,
    })
    if (this.winCondition === WinConditions.PLAYER_WIN) {
      winText.setText('Player Won!')
    } else if (this.winCondition === WinConditions.CPU_WIN) {
      winText.setText('CPU Won!')
    } else if (this.winCondition === WinConditions.TIE) {
      winText.setText("It's a tie!")
    }
    winText.setPosition(WINDOW_WIDTH / 2 - winText.displayWidth / 2, WINDOW_HEIGHT / 2.5)

    const scoreText = this.add.text(0, 0, `${this.playerScore} - ${this.cpuScore}`, {
      fontSize: '35px',
      fontFamily: DEFAULT_FONT,
    })
    scoreText.setPosition(
      WINDOW_WIDTH / 2 - scoreText.displayWidth / 2,
      winText.y + winText.displayHeight + 10
    )

    const startButton = button('Play Again', {
      fontFamily: DEFAULT_FONT,
      fontSize: '20px',
      color: 'black',
      width: 150,
      height: 40,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'black',
      borderRadius: '10px',
      cursor: 'pointer',
    }) as HTMLElement

    const startButtonDOM = this.add
      .dom(this.scale.width / 2, scoreText.y + 75, startButton)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        this.scene.start('game')
      })
  }
}
