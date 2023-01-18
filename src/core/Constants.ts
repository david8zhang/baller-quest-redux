import Game from '~/scenes/Game'
import { CourtPlayer } from './CourtPlayer'
import { ShotCoverage } from './states/offense/ShootingState'
import { Team } from './Team'

export const DEFAULT_FONT = 'Superstar'

export const BLOCK_LIKELIHOOD_ATTRIBUTE_MAPPING = {
  '5': 80,
  '4': 60,
  '3': 40,
  '2': 20,
  '1': 10,
}

export const DUNK_LIKELIHOOD_ATTRIBUTE_MAPPING = {
  '5': 90,
  '4': 75,
  '3': 60,
  '2': 45,
  '1': 30,
}

export const SHOOTING_CONFIGS_CPU = {
  '1': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 50,
      [ShotCoverage.OPEN]: 45,
      [ShotCoverage.CONTESTED]: 10,
      [ShotCoverage.SMOTHERED]: 5,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 65,
      [ShotCoverage.OPEN]: 50,
      [ShotCoverage.CONTESTED]: 15,
      [ShotCoverage.SMOTHERED]: 10,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 75,
      [ShotCoverage.OPEN]: 65,
      [ShotCoverage.CONTESTED]: 55,
      [ShotCoverage.SMOTHERED]: 40,
    },
  },
  '2': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 55,
      [ShotCoverage.OPEN]: 50,
      [ShotCoverage.CONTESTED]: 15,
      [ShotCoverage.SMOTHERED]: 10,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 75,
      [ShotCoverage.OPEN]: 60,
      [ShotCoverage.CONTESTED]: 20,
      [ShotCoverage.SMOTHERED]: 15,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 85,
      [ShotCoverage.OPEN]: 75,
      [ShotCoverage.CONTESTED]: 60,
      [ShotCoverage.SMOTHERED]: 45,
    },
  },
  '3': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 60,
      [ShotCoverage.OPEN]: 55,
      [ShotCoverage.CONTESTED]: 25,
      [ShotCoverage.SMOTHERED]: 20,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 80,
      [ShotCoverage.OPEN]: 65,
      [ShotCoverage.CONTESTED]: 25,
      [ShotCoverage.SMOTHERED]: 10,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 100,
      [ShotCoverage.OPEN]: 95,
      [ShotCoverage.CONTESTED]: 75,
      [ShotCoverage.SMOTHERED]: 60,
    },
  },
  '4': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 70,
      [ShotCoverage.OPEN]: 55,
      [ShotCoverage.CONTESTED]: 30,
      [ShotCoverage.SMOTHERED]: 25,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 100,
      [ShotCoverage.OPEN]: 80,
      [ShotCoverage.CONTESTED]: 45,
      [ShotCoverage.SMOTHERED]: 20,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 100,
      [ShotCoverage.OPEN]: 100,
      [ShotCoverage.CONTESTED]: 95,
      [ShotCoverage.SMOTHERED]: 70,
    },
  },
  '5': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 80,
      [ShotCoverage.OPEN]: 65,
      [ShotCoverage.CONTESTED]: 50,
      [ShotCoverage.SMOTHERED]: 30,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 100,
      [ShotCoverage.OPEN]: 100,
      [ShotCoverage.CONTESTED]: 75,
      [ShotCoverage.SMOTHERED]: 50,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 100,
      [ShotCoverage.OPEN]: 100,
      [ShotCoverage.CONTESTED]: 95,
      [ShotCoverage.SMOTHERED]: 85,
    },
  },
}

export const SHOOTING_CONFIGS = {
  '1': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 30,
      [ShotCoverage.OPEN]: 25,
      [ShotCoverage.CONTESTED]: 1,
      [ShotCoverage.SMOTHERED]: 0,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 55,
      [ShotCoverage.OPEN]: 40,
      [ShotCoverage.CONTESTED]: 5,
      [ShotCoverage.SMOTHERED]: 0,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 70,
      [ShotCoverage.OPEN]: 60,
      [ShotCoverage.CONTESTED]: 45,
      [ShotCoverage.SMOTHERED]: 30,
    },
  },
  '2': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 35,
      [ShotCoverage.OPEN]: 30,
      [ShotCoverage.CONTESTED]: 5,
      [ShotCoverage.SMOTHERED]: 0,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 65,
      [ShotCoverage.OPEN]: 50,
      [ShotCoverage.CONTESTED]: 10,
      [ShotCoverage.SMOTHERED]: 1,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 80,
      [ShotCoverage.OPEN]: 70,
      [ShotCoverage.CONTESTED]: 55,
      [ShotCoverage.SMOTHERED]: 40,
    },
  },
  '3': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 50,
      [ShotCoverage.OPEN]: 40,
      [ShotCoverage.CONTESTED]: 10,
      [ShotCoverage.SMOTHERED]: 1,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 75,
      [ShotCoverage.OPEN]: 60,
      [ShotCoverage.CONTESTED]: 20,
      [ShotCoverage.SMOTHERED]: 5,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 95,
      [ShotCoverage.OPEN]: 80,
      [ShotCoverage.CONTESTED]: 65,
      [ShotCoverage.SMOTHERED]: 50,
    },
  },
  '4': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 65,
      [ShotCoverage.OPEN]: 50,
      [ShotCoverage.CONTESTED]: 20,
      [ShotCoverage.SMOTHERED]: 5,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 90,
      [ShotCoverage.OPEN]: 75,
      [ShotCoverage.CONTESTED]: 40,
      [ShotCoverage.SMOTHERED]: 15,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 100,
      [ShotCoverage.OPEN]: 95,
      [ShotCoverage.CONTESTED]: 80,
      [ShotCoverage.SMOTHERED]: 65,
    },
  },
  '5': {
    three: {
      [ShotCoverage.WIDE_OPEN]: 75,
      [ShotCoverage.OPEN]: 60,
      [ShotCoverage.CONTESTED]: 30,
      [ShotCoverage.SMOTHERED]: 10,
    },
    two: {
      [ShotCoverage.WIDE_OPEN]: 100,
      [ShotCoverage.OPEN]: 90,
      [ShotCoverage.CONTESTED]: 55,
      [ShotCoverage.SMOTHERED]: 25,
    },
    layup: {
      [ShotCoverage.WIDE_OPEN]: 100,
      [ShotCoverage.OPEN]: 100,
      [ShotCoverage.CONTESTED]: 95,
      [ShotCoverage.SMOTHERED]: 80,
    },
  },
}

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
  let bestShotPercentage: number = Number.MIN_SAFE_INTEGER

  // Check if team mates are open
  for (let i = 0; i < teammates.length; i++) {
    const teammate = teammates[i]
    const isThreePointShot = Game.instance.court.isThreePointShot(teammate.x, teammate.y)
    const shotPercentageData = calculateShotSuccessPercentage(
      teammate,
      team,
      isThreePointShot,
      false
    )
    if (shotPercentageData.percentage > bestShotPercentage) {
      recipient = teammate
      bestShotPercentage = shotPercentageData.percentage
    }
  }
  if (bestShotPercentage <= 50) {
    return null
  }
  return recipient
}

export const calculateShotSuccessPercentage = (
  currPlayer: CourtPlayer,
  team: Team,
  isThreePointShot: boolean,
  isLayup: boolean
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

  let shotAttribute = currPlayer.attributes.shooting
  const shootingConfigs = currPlayer.side === Side.PLAYER ? SHOOTING_CONFIGS : SHOOTING_CONFIGS_CPU
  const allConfigs = shootingConfigs[shotAttribute.toString()]
  let percentagesConfig = allConfigs.two
  if (isThreePointShot) {
    percentagesConfig = allConfigs.three
  } else if (isLayup) {
    shotAttribute = currPlayer.attributes.layup
    percentagesConfig = shootingConfigs[shotAttribute.toString()].layup
  }
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
