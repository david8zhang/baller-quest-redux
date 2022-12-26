export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('highlight-cursor', 'highlight-cursor.png')
    this.load.image('hoop-rim', 'hoop-rim.png')
    this.load.image('hoop-stand', 'hoop-stand.png')
    this.load.image('ball', 'ball.png')

    this.loadDunkAnimations()
    this.loadLayupAnimations()
    this.loadShootAnimations()
    this.loadDribbleAnimations()
    this.loadIdleAnimations()
    this.loadRunAnimations()
  }

  loadRunAnimations() {
    this.load.atlas(
      'run-side',
      'animations/run/run-side/run-side.png',
      'animations/run/run-side/run-side.json'
    )
    this.load.atlas(
      'run-with-ball-side',
      'animations/run/run-with-ball-side/run-with-ball-side.png',
      'animations/run/run-with-ball-side/run-with-ball-side.json'
    )
    this.load.atlas(
      'run-with-ball-front',
      'animations/run/run-with-ball-front/run-with-ball-front.png',
      'animations/run/run-with-ball-front/run-with-ball-front.json'
    )
    this.load.atlas(
      'run-front',
      'animations/run/run-front/run-front.png',
      'animations/run/run-front/run-front.json'
    )
  }

  loadDribbleAnimations() {
    this.load.atlas(
      'dribble-front',
      'animations/dribble/dribble-front/dribble-front.png',
      'animations/dribble/dribble-front/dribble-front.json'
    )
  }

  loadShootAnimations() {
    // Shoot front
    this.load.image('shoot-jump-front', 'animations/shoot/shoot-front/shoot-jump-front.png')
    this.load.image('shoot-flick-front', 'animations/shoot/shoot-front/shoot-flick-front.png')

    // Shoot side
    this.load.image('shoot-side-wind', 'animations/shoot/shoot-side/shoot-side-wind.png')
    this.load.image('shoot-side-release', 'animations/shoot/shoot-side/shoot-side-release.png')
    this.load.image('shoot-side-follow', 'animations/shoot/shoot-side/shoot-side-follow.png')
  }

  loadDunkAnimations() {
    this.load.image('dunk-arm-out-front', 'animations/dunk/dunk-front/dunk-arm-out-front.png')
    this.load.image('dunk-finish-front', 'animations/dunk/dunk-front/dunk-finish-front.png')
    this.load.image('dunk-wind-up-front', 'animations/dunk/dunk-front/dunk-wind-up-front.png')
  }

  loadIdleAnimations() {
    this.load.atlas(
      'idle-front',
      'animations/idle/idle-front/idle-front.png',
      'animations/idle/idle-front/idle-front.json'
    )
  }

  loadLayupAnimations() {
    this.load.image('layup-gather-front', 'animations/layup/layup-front/layup-gather-front.png')
    this.load.image('layup-arm-out-front', 'animations/layup/layup-front/layup-arm-out-front.png')
    this.load.image('layup-flick-front', 'animations/layup/layup-front/layup-flick-front.png')
  }

  create() {
    this.scene.start('game')
  }
}
