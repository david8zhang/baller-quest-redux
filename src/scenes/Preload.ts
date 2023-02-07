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
    this.loadDefendAnimations()
    this.loadNetSwishAnimations()
    this.loadStealAnimations()
    this.loadScreenAnimations()
    this.loadFumbleAnimations()
    this.loadCrossoverAnimations()
    this.loadUIImages()
    this.loadAuraAnimations()
    this.loadSprintAnimations()
  }

  loadSprintAnimations() {
    this.load.atlas(
      'sprint-side-player',
      'animations/run/sprint-with-ball-side/player-sprint-side.png',
      'animations/run/sprint-with-ball-side/player-sprint-side.json'
    )
  }

  loadAuraAnimations() {
    this.load.atlas('aura', 'animations/aura/aura.png', 'animations/aura/aura.json')
  }

  loadCrossoverAnimations() {
    this.load.image(
      'crossover-player-start',
      'animations/dribble/crossover/player/crossover-player-start.png'
    )
    this.load.image(
      'crossover-player-transition-1',
      'animations/dribble/crossover/player/crossover-player-transition-1.png'
    )
    this.load.image(
      'crossover-player-transition-2',
      'animations/dribble/crossover/player/crossover-player-transition-2.png'
    )
    this.load.image(
      'crossover-player-finish',
      'animations/dribble/crossover/player/crossover-player-finish.png'
    )

    this.load.atlas(
      'crossover-escape-player',
      'animations/dribble/crossover/player/crossover-escape-player.png',
      'animations/dribble/crossover/player/crossover-escape-player.json'
    )
  }

  loadUIImages() {
    this.load.image('arrowLeft', 'ui/arrowLeft.png')
    this.load.image('arrowRight', 'ui/arrowRight.png')
    this.load.image('arrowUp', 'ui/arrowUp.png')
    this.load.image('arrowDown', 'ui/arrowDown.png')
  }

  loadFumbleAnimations() {
    this.load.image('fumble-cpu-start', 'animations/fumble/cpu-fumble-start.png')
    this.load.image('fumble-cpu-fall', 'animations/fumble/cpu-fumble-fall.png')
    this.load.image('fumble-cpu-end', 'animations/fumble/cpu-fumble-end.png')

    this.load.image('fumble-player-start', 'animations/fumble/player-fumble-start.png')
    this.load.image('fumble-player-fall', 'animations/fumble/player-fumble-fall.png')
    this.load.image('fumble-player-end', 'animations/fumble/player-fumble-end.png')
  }

  loadScreenAnimations() {
    this.load.image('screen-cpu', 'animations/screen/screen-cpu.png')
    this.load.image('screen-player', 'animations/screen/screen-player.png')
  }

  loadStealAnimations() {
    this.load.image('steal-wind-player', 'animations/steal/steal-wind-player.png')
    this.load.image('steal-reach-player', 'animations/steal/steal-reach-player.png')
    this.load.image('steal-follow-player', 'animations/steal/steal-follow-player.png')

    this.load.image('steal-wind-cpu', 'animations/steal/steal-wind-cpu.png')
    this.load.image('steal-reach-cpu', 'animations/steal/steal-reach-cpu.png')
    this.load.image('steal-follow-cpu', 'animations/steal/steal-follow-cpu.png')
  }

  loadNetSwishAnimations() {
    this.load.atlas(
      'net-swish-up',
      'animations/net-swish/net-swish-up/net-swish-up.png',
      'animations/net-swish/net-swish-up/net-swish-up.json'
    )
    this.load.atlas(
      'net-swish-left',
      'animations/net-swish/net-swish-left/net-swish-left.png',
      'animations/net-swish/net-swish-left/net-swish-left.json'
    )
    this.load.atlas(
      'net-swish-right',
      'animations/net-swish/net-swish-right/net-swish-right.png',
      'animations/net-swish/net-swish-right/net-swish-right.json'
    )
  }

  loadBlockAnimations() {
    this.load.image(
      'block-front-wind-up-player',
      'animations/block/block-front/block-wind-up-player.png'
    )
    this.load.image(
      'block-front-swing-player',
      'animations/block/block-front/block-swing-player.png'
    )

    this.load.image('block-front-wind-up-cpu', 'animations/block/block-front/block-wind-up-cpu.png')
    this.load.image('block-front-swing-cpu', 'animations/block/block-front/block-swing-cpu.png')
  }

  loadCourtAnimations() {
    this.load.image('court', 'court.png')
  }

  loadPassAnimations() {
    this.load.image(
      'pass-front-wind-up-player',
      'animations/pass/pass-front/pass-wind-up-player.png'
    )
    this.load.image(
      'pass-front-release-player',
      'animations/pass/pass-front/pass-release-player.png'
    )

    this.load.image('pass-back-wind-up-player', 'animations/pass/pass-back/pass-wind-up-player.png')
    this.load.image('pass-back-release-player', 'animations/pass/pass-back/pass-release-player.png')

    this.load.image('pass-side-wind-up-player', 'animations/pass/pass-side/pass-wind-up-player.png')
    this.load.image('pass-side-release-player', 'animations/pass/pass-side/pass-release-player.png')

    this.load.image('pass-front-wind-up-cpu', 'animations/pass/pass-front/pass-wind-up-cpu.png')
    this.load.image('pass-front-release-cpu', 'animations/pass/pass-front/pass-release-cpu.png')

    this.load.image('pass-back-wind-up-cpu', 'animations/pass/pass-back/pass-wind-up-cpu.png')
    this.load.image('pass-back-release-cpu', 'animations/pass/pass-back/pass-release-cpu.png')

    this.load.image('pass-side-wind-up-cpu', 'animations/pass/pass-side/pass-wind-up-cpu.png')
    this.load.image('pass-side-release-cpu', 'animations/pass/pass-side/pass-release-cpu.png')
  }

  loadContestAnimations() {
    this.load.image('contest-front-player', 'animations/contest/contest-front-player.png')
    this.load.image('contest-front-cpu', 'animations/contest/contest-front-cpu.png')
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

    this.load.atlas(
      'run-side-cpu',
      'animations/run/run-side/run-side-cpu.png',
      'animations/run/run-side/run-side-cpu.json'
    )
    this.load.atlas(
      'run-with-ball-side-cpu',
      'animations/run/run-with-ball-side/run-with-ball-side-cpu.png',
      'animations/run/run-with-ball-side/run-with-ball-side-cpu.json'
    )
    this.load.atlas(
      'run-with-ball-front-cpu',
      'animations/run/run-with-ball-front/run-with-ball-front-cpu.png',
      'animations/run/run-with-ball-front/run-with-ball-front-cpu.json'
    )
    this.load.atlas(
      'run-front-cpu',
      'animations/run/run-front/run-front-cpu.png',
      'animations/run/run-front/run-front-cpu.json'
    )
  }

  loadDribbleAnimations() {
    this.load.atlas(
      'dribble-front-player',
      'animations/dribble/dribble-front/dribble-front-player.png',
      'animations/dribble/dribble-front/dribble-front-player.json'
    )
    this.load.atlas(
      'dribble-front-cpu',
      'animations/dribble/dribble-front/dribble-front-cpu.png',
      'animations/dribble/dribble-front/dribble-front-cpu.json'
    )

    this.load.atlas(
      'dribble-intense-player',
      'animations/dribble/dribble-intense/dribble-intense-player.png',
      'animations/dribble/dribble-intense/dribble-intense-player.json'
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
    this.load.image(
      'shoot-side-wind-player',
      'animations/shoot/shoot-side/shoot-side-wind-player.png'
    )
    this.load.image(
      'shoot-side-release-player',
      'animations/shoot/shoot-side/shoot-side-release-player.png'
    )

    // Shoot side
    this.load.image('shoot-side-wind-cpu', 'animations/shoot/shoot-side/shoot-side-wind-cpu.png')
    this.load.image(
      'shoot-side-release-cpu',
      'animations/shoot/shoot-side/shoot-side-release-cpu.png'
    )
    this.load.image('shoot-jump-front-cpu', 'animations/shoot/shoot-front/shoot-jump-front-cpu.png')
    this.load.image(
      'shoot-flick-front-cpu',
      'animations/shoot/shoot-front/shoot-flick-front-cpu.png'
    )
  }

  loadDunkAnimations() {
    this.load.image(
      'dunk-arm-out-front-player',
      'animations/dunk/dunk-front/dunk-arm-out-front-player.png'
    )
    this.load.image(
      'dunk-finish-front-player',
      'animations/dunk/dunk-front/dunk-finish-front-player.png'
    )
    this.load.image(
      'dunk-wind-up-front-player',
      'animations/dunk/dunk-front/dunk-wind-up-front-player.png'
    )

    this.load.image(
      'dunk-arm-out-front-cpu',
      'animations/dunk/dunk-front/dunk-arm-out-front-cpu.png'
    )
    this.load.image('dunk-finish-front-cpu', 'animations/dunk/dunk-front/dunk-finish-front-cpu.png')
    this.load.image(
      'dunk-wind-up-front-cpu',
      'animations/dunk/dunk-front/dunk-wind-up-front-cpu.png'
    )
  }

  loadIdleAnimations() {
    this.load.atlas(
      'idle-front-player',
      'animations/idle/idle-front/idle-front-player.png',
      'animations/idle/idle-front/idle-front-player.json'
    )
    this.load.atlas(
      'idle-front-cpu',
      'animations/idle/idle-front/idle-front-cpu.png',
      'animations/idle/idle-front/idle-front-cpu.json'
    )
  }

  loadLayupAnimations() {
    this.load.image(
      'layup-gather-front-player',
      'animations/layup/layup-front/layup-gather-front-player.png'
    )
    this.load.image(
      'layup-arm-out-front-player',
      'animations/layup/layup-front/layup-arm-out-front-player.png'
    )
    this.load.image(
      'layup-flick-front-player',
      'animations/layup/layup-front/layup-flick-front-player.png'
    )

    this.load.image(
      'layup-gather-front-cpu',
      'animations/layup/layup-front/layup-gather-front-cpu.png'
    )
    this.load.image(
      'layup-arm-out-front-cpu',
      'animations/layup/layup-front/layup-arm-out-front-cpu.png'
    )
    this.load.image(
      'layup-flick-front-cpu',
      'animations/layup/layup-front/layup-flick-front-cpu.png'
    )
  }

  loadDefendAnimations() {
    this.load.atlas(
      'defend-idle-cpu',
      'animations/defend/defend-idle/defend-idle-cpu.png',
      'animations/defend/defend-idle/defend-idle-cpu.json'
    )
    this.load.atlas(
      'defend-run-cpu',
      'animations/defend/defend-run/defend-run-cpu.png',
      'animations/defend/defend-run/defend-run-cpu.json'
    )

    this.load.atlas(
      'defend-idle-player',
      'animations/defend/defend-idle/defend-idle-player.png',
      'animations/defend/defend-idle/defend-idle-player.json'
    )
    this.load.atlas(
      'defend-run-player',
      'animations/defend/defend-run/defend-run-player.png',
      'animations/defend/defend-run/defend-run-player.json'
    )
  }

  create() {
    this.scene.start('start')
  }
}
