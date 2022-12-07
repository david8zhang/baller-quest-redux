export const WINDOW_WIDTH = 800
export const WINDOW_HEIGHT = 600

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHt = 'right',
}

export const PLAYER_SPEED = 150

export const createArc = (
  sprite: Phaser.Physics.Arcade.Sprite,
  landingPosition: { x: number; y: number },
  duration: number
) => {
  const xVelocity = (landingPosition.x - sprite.x) / duration
  const yVelocity = (landingPosition.y - sprite.y - 490 * Math.pow(duration, 2)) / duration
  sprite.setVelocity(xVelocity, yVelocity)
  sprite.setGravityY(980)
}
