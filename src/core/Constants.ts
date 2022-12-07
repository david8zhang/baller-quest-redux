export const WINDOW_WIDTH = 864
export const WINDOW_HEIGHT = 640

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

export const OFFBALL_ANIMS = {
  idle: 'idle',
  run: 'run',
}

export const ONBALL_ANIMS = {
  idle: 'dribble-front',
  run: 'run-with-ball',
}
