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
}
