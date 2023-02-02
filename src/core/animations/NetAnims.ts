export const createNetAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'net-swish-up',
    frames: anims.generateFrameNames('net-swish-up', {
      frames: [0, 1, 2, 1, 0],
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 12,
  })

  anims.create({
    key: 'net-swish-left',
    frames: anims.generateFrameNames('net-swish-left', {
      frames: [0, 1, 2, 1, 0],
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 12,
  })

  anims.create({
    key: 'net-swish-right',
    frames: anims.generateFrameNames('net-swish-right', {
      frames: [0, 1, 2, 1, 0],
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 12,
  })
}
