import { DEFAULT_FONT, WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { button } from '~/ui/Button'

export class Start extends Phaser.Scene {
  constructor() {
    super('start')
  }

  create() {
    const titleText = this.add.text(0, 0, 'Baller Quest', {
      fontSize: '75px',
      fontFamily: DEFAULT_FONT,
      color: 'white',
    })
    titleText.setPosition(WINDOW_WIDTH / 2 - titleText.displayWidth / 2, WINDOW_HEIGHT / 2.5)

    const startButton = button('Play', {
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
      .dom(this.scale.width / 2, titleText.y + 125, startButton)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        this.scene.start('game')
      })
  }
}
