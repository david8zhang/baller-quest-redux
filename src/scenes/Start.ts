import { DEFAULT_FONT, WINDOW_HEIGHT, WINDOW_WIDTH } from '~/core/Constants'
import { Hoop } from '~/core/Hoop'
import { button } from '~/ui/Button'

export class Start extends Phaser.Scene {
  constructor() {
    super('start')
  }

  create() {
    this.add.image(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2, 'court')
    this.add.image(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 - 175, 'hoop-stand').setScale(5)
    this.add.image(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 - 175, 'hoop-rim').setScale(5)
    this.add.rectangle(
      WINDOW_WIDTH / 2,
      WINDOW_HEIGHT / 2,
      WINDOW_WIDTH,
      WINDOW_HEIGHT,
      0x000000,
      0.1
    )

    const titleText = this.add.text(0, 0, 'Baller', {
      fontSize: '200px',
      fontFamily: DEFAULT_FONT,
      color: 'white',
    })
    titleText.setPosition(WINDOW_WIDTH / 2 - titleText.displayWidth / 2, WINDOW_HEIGHT / 6.25)
    titleText.setStroke('#000000', 20)

    const titleText2 = this.add.text(0, 0, 'Quest', {
      fontSize: '200px',
      fontFamily: DEFAULT_FONT,
      color: 'white',
    })
    titleText2.setPosition(WINDOW_WIDTH / 2 - titleText2.displayWidth / 2, WINDOW_HEIGHT / 2.5)
    titleText2.setStroke('#000000', 20)

    const startButton = button('Play', {
      fontFamily: DEFAULT_FONT,
      fontSize: '50px',
      color: 'black',
      width: 300,
      height: 80,
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: 'black',
      borderRadius: '25px',
      cursor: 'pointer',
    }) as HTMLElement

    const startButtonDOM = this.add
      .dom(this.scale.width / 2, titleText2.y + 250, startButton)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        this.scene.start('game')
      })
  }
}
