export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('hoop', 'hoop.png')
    this.load.image('ball', 'ball.png')
    this.load.image('shoot', 'animations/shoot.png')
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
