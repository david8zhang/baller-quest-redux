import Game from '~/scenes/Game'
import { CourtPlayer } from './CourtPlayer'
import { ShootingState, ShotCoverage } from './states/offense/ShootingState'
import { Team } from './Team'

export const DEFAULT_FONT = 'Superstar'

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

export const getMostOpenPassRecipient = (teammates: CourtPlayer[], team: Team) => {
  let recipient: CourtPlayer | null = null
  let bestShotCoverage: ShotCoverage | null = null

  // Check if team mates are open
  for (let i = 0; i < teammates.length; i++) {
    const teammate = teammates[i]
    const isThreePointShot = Game.instance.court.isThreePointShot(teammate.x, teammate.y)
    const shotPercentageData = calculateShotSuccessPercentage(teammate, team, isThreePointShot)
    if (shotPercentageData.coverage === ShotCoverage.OPEN) {
      if (!recipient) {
        recipient = teammate
        bestShotCoverage = ShotCoverage.OPEN
      }
    }
    if (shotPercentageData.coverage === ShotCoverage.WIDE_OPEN) {
      if (!recipient || bestShotCoverage === ShotCoverage.OPEN) {
        recipient = teammate
        bestShotCoverage = ShotCoverage.WIDE_OPEN
      }
    }
  }
  return recipient
}

export const calculateShotSuccessPercentage = (
  currPlayer: CourtPlayer,
  team: Team,
  isThreePointShot: boolean
) => {
  const shotContesters = team.getOtherTeamCourtPlayers()
  const closestContester = getClosestPlayer(currPlayer, shotContesters)
  let shotCoverage: ShotCoverage = ShotCoverage.SMOTHERED
  if (closestContester) {
    const distToClosestContester = Phaser.Math.Distance.Between(
      currPlayer.sprite.x,
      currPlayer.sprite.y,
      closestContester.sprite.x,
      closestContester.sprite.y
    )
    if (distToClosestContester > 100) {
      shotCoverage = ShotCoverage.WIDE_OPEN
    }
    if (distToClosestContester <= 100 && distToClosestContester > 80) {
      shotCoverage = ShotCoverage.OPEN
    }
    if (distToClosestContester <= 80 && distToClosestContester > 65) {
      shotCoverage = ShotCoverage.CONTESTED
    }
  } else {
    shotCoverage = ShotCoverage.WIDE_OPEN
  }
  const percentagesConfig = isThreePointShot
    ? ShootingState.THREE_POINT_PERCENTAGES
    : ShootingState.MID_RANGE_PERCENTAGES
  return {
    coverage: shotCoverage,
    percentage: percentagesConfig[shotCoverage],
  }
}

export const SORT_ORDER = {
  ui: 100,
  rim: 10,
  ball: 5,
  stand: 1,
}

export const OFFBALL_ANIMS = {
  idle: 'idle-front',
  idleDefend: 'defend-idle',
  run: {
    [Direction.UP]: 'run-front',
    [Direction.DOWN]: 'run-front',
    [Direction.LEFT]: 'run-side',
    [Direction.RIGHT]: 'run-side',
  },
  defend: {
    [Direction.UP]: 'defend-run',
    [Direction.LEFT]: 'defend-run',
    [Direction.RIGHT]: 'defend-run',
    [Direction.DOWN]: 'defend-run',
  },
}

export const ONBALL_ANIMS = {
  idle: 'dribble-front',
  run: {
    [Direction.UP]: 'run-with-ball-front',
    [Direction.DOWN]: 'run-with-ball-front',
    [Direction.LEFT]: 'run-with-ball-side',
    [Direction.RIGHT]: 'run-with-ball-side',
  },
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
