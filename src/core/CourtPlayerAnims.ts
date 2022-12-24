export const createPlayerAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'idle-front',
    frames: anims.generateFrameNames('idle-front', {
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
    key: 'run-with-ball-side',
    frames: anims.generateFrameNames('run-with-ball-side', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })

  anims.create({
    key: 'run-side',
    frames: anims.generateFrameNames('run-side', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 6,
  })
}
