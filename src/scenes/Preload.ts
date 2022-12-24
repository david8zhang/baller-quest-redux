export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('highlight-cursor', 'highlight-cursor.png')
    this.load.image('hoop-rim', 'hoop-rim.png')
    this.load.image('hoop-stand', 'hoop-stand.png')
    this.load.image('ball', 'ball.png')

    // Layup animations
    this.load.image('layup-gather', 'animations/layup-front/layup-gather.png')
    this.load.image('layup-arm-out', 'animations/layup-front/layup-arm-out.png')
    this.load.image('layup-flick', 'animations/layup-front/layup-flick.png')

    // Shoot animations
    this.load.image('shoot-jump', 'animations/shoot-front/shoot-jump.png')
    this.load.image('shoot-flick', 'animations/shoot-front/shoot-flick.png')

    // Dribble animations
    this.load.atlas(
      'dribble-front',
      'animations/dribble-front/dribble-front.png',
      'animations/dribble-front/dribble-front.json'
    )

    // Idle animations
    this.load.atlas('idle', 'animations/idle/idle.png', 'animations/idle/idle.json')

    // Run with ball animations
    this.load.atlas(
      'run-with-ball',
      'animations/run-with-ball/run-with-ball.png',
      'animations/run-with-ball/run-with-ball.json'
    )

    // Run animations
    this.load.atlas('run', 'animations/run/run.png', 'animations/run/run.json')
  }

  create() {
    this.scene.start('game')
  }
}
