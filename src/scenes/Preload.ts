export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('highlight-cursor', 'highlight-cursor.png')
    this.load.image('hoop-rim', 'hoop-rim.png')
    this.load.image('hoop-stand', 'hoop-stand.png')
    this.load.image('ball', 'ball.png')
    this.load.image('shoot-jump', 'animations/shoot-jump.png')
    this.load.image('shoot-flick', 'animations/shoot-flick.png')
    this.load.atlas(
      'dribble-front',
      'animations/dribble-front.png',
      'animations/dribble-front.json'
    )
    this.load.atlas('idle', 'animations/idle.png', 'animations/idle.json')
    this.load.atlas(
      'run-with-ball',
      'animations/run-with-ball.png',
      'animations/run-with-ball.json'
    )
    this.load.atlas('run', 'animations/run.png', 'animations/run.json')
  }

  create() {
    this.scene.start('game')
  }
}
