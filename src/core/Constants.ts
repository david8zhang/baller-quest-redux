import { CourtPlayer } from './CourtPlayer'

export const WINDOW_WIDTH = 864
export const WINDOW_HEIGHT = 640

export const LAYUP_DISTANCE = 180

export enum Side {
  PLAYER = 'PLAYER',
  CPU = 'CPU',
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export const COURT_PLAYER_SPEED = 200
export const COURT_PLAYER_DEFENSE_SPEED = 250
export const COURT_PLAYER_SPRINT_SPEED = 300
export const COURT_PLAYER_TIRED_SPEED = 150

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
  ui: 100,
  rim: 10,
  ball: 5,
  stand: 1,
}

export const OFFBALL_ANIMS = {
  idle: 'idle-front',
  run: 'run-side',
}

export const ONBALL_ANIMS = {
  idle: 'dribble-front',
  run: 'run-with-ball-side',
}

export const getClosestPlayer = (src: CourtPlayer, courtPlayers: CourtPlayer[]): CourtPlayer => {
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
