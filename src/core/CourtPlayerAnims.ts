export const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'idle',
    frames: anims.generateFrameNames('idle', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'dribble-front',
    frames: anims.generateFrameNames('dribble-front', {
      start: 0,
      end: 3,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-with-ball',
    frames: anims.generateFrameNames('run-with-ball', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run',
    frames: anims.generateFrameNames('run', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })
}
