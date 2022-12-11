import { CourtPlayer } from './CourtPlayer'

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

export const SORT_ORDER = {
  rim: 10,
  ball: 5,
  stand: 1,
}

export const OFFBALL_ANIMS = {
  idle: 'idle',
  run: 'run',
}

export const ONBALL_ANIMS = {
  idle: 'dribble-front',
  run: 'run-with-ball',
}

export const INITIAL_PLAYER_POSITIONS = {
  player1: {
    row: 17,
    col: 13,
  },
  player2: {
    row: 16,
    col: 20,
  },
  player3: {
    row: 16,
    col: 6,
  },
}

export const getClosestPlayer = (src: CourtPlayer, courtPlayers: CourtPlayer[]) => {
  let closestPlayer: any = null
  const velocityVector = src.sprite.body.velocity
  let shortestDistance = Number.MAX_SAFE_INTEGER
  const srcPosition = new Phaser.Math.Vector2(
    src.sprite.x + velocityVector.x,
    src.sprite.y + velocityVector.y
  )
  courtPlayers.forEach((p: CourtPlayer) => {
    if (p !== src) {
      const position = new Phaser.Math.Vector2(p.sprite.x, p.sprite.y)
      const distance = Phaser.Math.Distance.BetweenPoints(srcPosition, position)
      if (distance < shortestDistance) {
        shortestDistance = distance
        closestPlayer = p
      }
    }
  })
  return closestPlayer
}

export const getDistanceBetween = (
  point1: { x: number; y: number },
  point2: { x: number; y: number }
) => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}
