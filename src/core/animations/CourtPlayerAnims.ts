export const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'aura',
    frames: anims.generateFrameNames('aura', {
      frames: [0, 1, 2, 3, 2, 1],
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 12,
  })

  anims.create({
    key: 'sprint-side-player',
    frames: anims.generateFrameNames('sprint-side-player', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'idle-front-player',
    frames: anims.generateFrameNames('idle-front-player', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'crossover-escape-player',
    frames: anims.generateFrameNames('crossover-escape-player', {
      frames: [1, 2, 3, 4, 5, 6],
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 6,
  })

  anims.create({
    key: 'dribble-intense-player',
    frames: anims.generateFrameNames('dribble-intense-player', {
      frames: [0, 1, 2, 3, 4, 3, 2, 1],
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 9,
  })

  anims.create({
    key: 'dribble-front-player',
    frames: anims.generateFrameNames('dribble-front-player', {
      start: 0,
      end: 3,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-with-ball-side-player',
    frames: anims.generateFrameNames('run-with-ball-side-player', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-side-player',
    frames: anims.generateFrameNames('run-side-player', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-with-ball-front-player',
    frames: anims.generateFrameNames('run-with-ball-front-player', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-front-player',
    frames: anims.generateFrameNames('run-front-player', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  // CPU Animations

  anims.create({
    key: 'idle-front-cpu',
    frames: anims.generateFrameNames('idle-front-cpu', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'defend-idle-cpu',
    frames: anims.generateFrameNames('defend-idle-cpu', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'defend-run-cpu',
    frames: anims.generateFrameNames('defend-run-cpu', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'defend-idle-player',
    frames: anims.generateFrameNames('defend-idle-player', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'defend-run-player',
    frames: anims.generateFrameNames('defend-run-player', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'dribble-front-cpu',
    frames: anims.generateFrameNames('dribble-front-cpu', {
      start: 0,
      end: 3,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-with-ball-side-cpu',
    frames: anims.generateFrameNames('run-with-ball-side-cpu', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-side-cpu',
    frames: anims.generateFrameNames('run-side-cpu', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-with-ball-front-cpu',
    frames: anims.generateFrameNames('run-with-ball-front-cpu', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-front-cpu',
    frames: anims.generateFrameNames('run-front-cpu', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })
}
