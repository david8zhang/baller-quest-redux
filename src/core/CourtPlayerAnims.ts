export const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {
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
}
