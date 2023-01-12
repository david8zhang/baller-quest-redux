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
    this.loadContestAnimations()
    this.loadPassAnimations()
    this.loadCourtAnimations()
    this.loadBlockAnimations()
  }

  loadBlockAnimations() {
    this.load.image('block-front-wind-up', 'animations/block/block-front/block-wind-up-player.png')
    this.load.image('block-front-swing', 'animations/block/block-front/block-swing-player.png')
  }

  loadCourtAnimations() {
    this.load.image('court', 'court.png')
  }

  loadPassAnimations() {
    this.load.image('pass-front-wind-up', 'animations/pass/pass-front/pass-wind-up-player.png')
    this.load.image('pass-front-release', 'animations/pass/pass-front/pass-release-player.png')

    this.load.image('pass-back-wind-up', 'animations/pass/pass-back/pass-wind-up-player.png')
    this.load.image('pass-back-release', 'animations/pass/pass-back/pass-release-player.png')

    this.load.image('pass-side-wind-up', 'animations/pass/pass-side/pass-wind-up-player.png')
    this.load.image('pass-side-release', 'animations/pass/pass-side/pass-release-player.png')
  }

  loadContestAnimations() {
    this.load.image('contest-front', 'animations/contest/contest-front-player.png')
  }

  loadRunAnimations() {
    this.load.atlas(
      'run-side-player',
      'animations/run/run-side/run-side-player.png',
      'animations/run/run-side/run-side-player.json'
    )
    this.load.atlas(
      'run-with-ball-side-player',
      'animations/run/run-with-ball-side/run-with-ball-side-player.png',
      'animations/run/run-with-ball-side/run-with-ball-side-player.json'
    )
    this.load.atlas(
      'run-with-ball-front-player',
      'animations/run/run-with-ball-front/run-with-ball-front-player.png',
      'animations/run/run-with-ball-front/run-with-ball-front-player.json'
    )
    this.load.atlas(
      'run-front-player',
      'animations/run/run-front/run-front-player.png',
      'animations/run/run-front/run-front-player.json'
    )
  }

  loadDribbleAnimations() {
    this.load.atlas(
      'dribble-front-player',
      'animations/dribble/dribble-front/dribble-front-player.png',
      'animations/dribble/dribble-front/dribble-front-player.json'
    )
  }

  loadShootAnimations() {
    // Shoot front
    this.load.image(
      'shoot-jump-front-player',
      'animations/shoot/shoot-front/shoot-jump-front-player.png'
    )
    this.load.image(
      'shoot-flick-front-player',
      'animations/shoot/shoot-front/shoot-flick-front-player.png'
    )

    // Shoot side
    this.load.image(
      'shoot-side-wind-player',
      'animations/shoot/shoot-side/shoot-side-wind-player.png'
    )
    this.load.image(
      'shoot-side-release-player',
      'animations/shoot/shoot-side/shoot-side-release-player.png'
    )
  }

  loadDunkAnimations() {
    this.load.image(
      'dunk-arm-out-front',
      'animations/dunk/dunk-front/dunk-arm-out-front-player.png'
    )
    this.load.image('dunk-finish-front', 'animations/dunk/dunk-front/dunk-finish-front-player.png')
    this.load.image(
      'dunk-wind-up-front',
      'animations/dunk/dunk-front/dunk-wind-up-front-player.png'
    )
  }

  loadIdleAnimations() {
    this.load.atlas(
      'idle-front-player',
      'animations/idle/idle-front/idle-front-player.png',
      'animations/idle/idle-front/idle-front-player.json'
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
