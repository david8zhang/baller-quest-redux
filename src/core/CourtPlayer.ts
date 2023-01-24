import Game from '~/scenes/Game'
import { BallState } from './Ball'
import {
  DEFAULT_FONT,
  DUNK_LIKELIHOOD_ATTRIBUTE_MAPPING,
  getDistanceBetween,
  LAYUP_DISTANCE,
  OFFBALL_ANIMS,
  ONBALL_ANIMS,
  Side,
  SORT_ORDER,
} from './Constants'
import { CourtPlayerAttributeMapper } from './CourtPlayerAttributeMapper'
import { createDecisionTree } from './CourtPlayerDecisionTree'
import { Blackboard } from './decision-tree/Blackboard'
import { TreeNode } from './decision-tree/TreeNode'
import { ChaseReboundState } from './states/ChaseReboundState'
import { DefendManState } from './states/defense/DefendManState'
import { FightOverScreenState } from './states/defense/FightOverScreenState'
import { HelpDefenseState } from './states/defense/HelpDefenseState'
import { SwitchDefenseState } from './states/defense/SwitchDefenseState'
import { IdleState } from './states/IdleState'
import { BlockShotState } from './states/defense/BlockShotState'
import { ContestShotState } from './states/offense/ContestShotState'
import { DribbleToPointState } from './states/offense/DribbleToPointState'
import { DriveToBasketState } from './states/offense/DriveToBasketState'
import { DunkState } from './states/offense/DunkState'
import { FumbleState } from './states/offense/FumbleState'
import { GoBackToSpotState } from './states/offense/GoBackToSpotState'
import { LayupState } from './states/offense/LayupState'
import { PassingState } from './states/offense/PassingState'
import { SetScreenState } from './states/offense/SetScreenState'
import { ShootingState } from './states/offense/ShootingState'
import { PlayerControlState } from './states/PlayerControlState'
import { StateMachine } from './states/StateMachine'
import { States } from './states/States'
import { Team } from './Team'
import { StealState } from './states/defense/StealState'

export interface PlayerAttributes {
  offSpeed: number
  defSpeed: number
  shooting: number
  block: number
  dunk: number
  layup: number
  steal: number
}

export interface CourtPlayerConfig {
  position: {
    x: number
    y: number
  }
  // all attributes are numbers between 1 and 5
  attributes: PlayerAttributes
  side: Side
  playerId: string
  tint?: number
  team: Team
}

export class CourtPlayer {
  private game: Game
  public side: Side
  public sprite: Phaser.Physics.Arcade.Sprite
  public hasPossession: boolean = false
  public playerId: string

  public shotReleased: boolean = false
  public wasShotBlocked: boolean = false
  public isOverlapping: boolean = false

  protected stateText: Phaser.GameObjects.Text
  protected playerIdText: Phaser.GameObjects.Text
  protected stateMachine: StateMachine
  protected team: Team
  protected decisionTree!: TreeNode
  protected blackboard: Blackboard
  public raycastIntersectRect: Phaser.Geom.Rectangle
  public playerOverlapRect: Phaser.Geom.Rectangle
  public attributes: PlayerAttributes

  public graphics: Phaser.GameObjects.Graphics

  constructor(game: Game, config: CourtPlayerConfig) {
    this.game = game
    const { position, side, tint, playerId, team } = config
    this.playerId = playerId
    this.side = side
    this.sprite = this.game.physics.add
      .sprite(position.x, position.y, 'idle-front')
      .setScale(3)
      .setDebug(true, true, 0x00ff00)
    if (tint) {
      this.sprite.setTintFill(tint)
    }
    this.sprite.setPushable(false)
    this.sprite.body.setSize(10, 15)
    this.sprite.body.offset.y = 16

    const anim = this.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle
    const suffix = this.side === Side.CPU ? 'cpu' : 'player'
    this.sprite.anims.play(`${anim}-${suffix}`)
    this.sprite.setData('ref', this)
    this.sprite.setCollideWorldBounds(true)

    this.raycastIntersectRect = new Phaser.Geom.Rectangle(this.sprite.x, this.sprite.y, 48, 64)
    this.playerOverlapRect = new Phaser.Geom.Rectangle(this.sprite.x, this.sprite.y, 32, 32)

    this.team = team
    this.stateMachine = new StateMachine(
      States.IDLE,
      {
        [States.IDLE]: new IdleState(),
        [States.DEFEND_MAN]: new DefendManState(),
        [States.CHASE_REBOUND]: new ChaseReboundState(),
        [States.SET_SCREEN]: new SetScreenState(),
        [States.GO_BACK_TO_SPOT]: new GoBackToSpotState(),
        [States.FIGHT_OVER_SCREEN]: new FightOverScreenState(),
        [States.SWITCH_DEFENSE]: new SwitchDefenseState(),
        [States.PASSING]: new PassingState(),
        [States.SHOOTING]: new ShootingState(),
        [States.CONTEST_SHOT]: new ContestShotState(),
        [States.LAYUP]: new LayupState(),
        [States.DUNK]: new DunkState(),
        [States.DRIBBLE_TO_POINT]: new DribbleToPointState(),
        [States.DRIVE_TO_BASKET]: new DriveToBasketState(),
        [States.PLAYER_CONTROL]: new PlayerControlState(),
        [States.BLOCK_SHOT]: new BlockShotState(),
        [States.FUMBLE]: new FumbleState(),
        [States.HELP_DEFENSE]: new HelpDefenseState(),
        [States.STEAL]: new StealState(),
      },
      [this, this.team]
    )
    this.stateText = Game.instance.add
      .text(this.x, this.y - 20, '', {
        fontSize: '12px',
        color: 'black',
      })
      .setDepth(SORT_ORDER.ui)
      .setVisible(false)
    this.playerIdText = Game.instance.add
      .text(this.x, this.y - 25, this.playerId, {
        fontSize: '16px',
        fontFamily: DEFAULT_FONT,
        color: 'black',
      })
      .setDepth(SORT_ORDER.ui)
    this.blackboard = new Blackboard()
    this.attributes = config.attributes
    this.setupDecisionTree()

    this.graphics = this.game.add.graphics()
    this.graphics.lineStyle(1, 0x00ff00)
    this.graphics.setDepth(SORT_ORDER.ui + 1000)
    this.graphics.setName('ui')
  }

  getOffSpeedFromAttr() {
    const offSpeed = CourtPlayerAttributeMapper.getOffensiveMovementSpeedFromAttr(
      this.attributes.offSpeed
    )
    if (this.isOverlapping) {
      const overlapSlowdownFactor = this.getOverlapSlowdownFactor()
      return offSpeed * overlapSlowdownFactor
    }
    return offSpeed
  }

  getOverlapSlowdownFactor() {
    const otherPlayers = this.team.getOtherTeamCourtPlayers()
    let intersectRectArea = 0
    for (let i = 0; i < otherPlayers.length; i++) {
      const courtPlayer = otherPlayers[i]
      const outputRect = new Phaser.Geom.Rectangle()
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.playerOverlapRect,
          courtPlayer.playerOverlapRect
        )
      ) {
        Phaser.Geom.Intersects.GetRectangleIntersection(
          this.playerOverlapRect,
          courtPlayer.playerOverlapRect,
          outputRect
        )
        intersectRectArea = outputRect.width * outputRect.height
      }
    }
    if (intersectRectArea < 25) {
      return 0.8
    }
    if (intersectRectArea >= 25 && intersectRectArea < 100) {
      return 0.75
    }
    if (intersectRectArea >= 50 && intersectRectArea < 250) {
      return 0.7
    }
    if (intersectRectArea >= 250) {
      return 0.65
    }
    return 1
  }

  getDefSpeedFromAttr() {
    return CourtPlayerAttributeMapper.getDefensiveMovementSpeedFromAttr(this.attributes.defSpeed)
  }

  canDunkBall() {
    const state = this.getCurrState().key
    const dunkAttribute = this.attributes.dunk
    const randNum = Phaser.Math.Between(0, 100)
    const dunkLikelihood = DUNK_LIKELIHOOD_ATTRIBUTE_MAPPING[dunkAttribute.toString()]

    return (
      !this.hasDefenderInFront() &&
      this.withinDunkOrLayupRange() &&
      this.team.shouldDunk() &&
      randNum <= dunkLikelihood &&
      this.hasPossession &&
      state !== States.LAYUP &&
      state !== States.DUNK
    )
  }

  withinDunkOrLayupRange() {
    const distanceToHoop = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      Game.instance.hoop.standSprite.x,
      Game.instance.hoop.standSprite.y
    )
    return distanceToHoop <= LAYUP_DISTANCE
  }

  hasDefenderInFront() {
    const lineToHoop = new Phaser.Geom.Line(
      this.sprite.x,
      this.sprite.y,
      Game.instance.hoop.standSprite.x,
      Game.instance.hoop.standSprite.y
    )
    let intersectsWithDefender = false
    this.team.getOtherTeamCourtPlayers().forEach((p: CourtPlayer) => {
      if (Phaser.Geom.Intersects.LineToRectangle(lineToHoop, p.raycastIntersectRect)) {
        intersectsWithDefender = true
      }
    })
    return intersectsWithDefender
  }

  canLayupBall() {
    const currState = this.getCurrState().key
    return (
      !this.hasDefenderInFront() &&
      this.withinDunkOrLayupRange() &&
      this.hasPossession &&
      currState !== States.LAYUP &&
      currState !== States.DUNK
    )
  }

  setupDecisionTree() {
    this.decisionTree = createDecisionTree(this.blackboard, this, this.team)
  }

  step() {
    this.stateMachine.step()
  }

  canPassBall() {
    const state = this.getCurrState().key
    return (
      this.hasPossession &&
      state !== States.SHOOTING &&
      state !== States.PASSING &&
      Game.instance.ball.ballState !== BallState.PASS
    )
  }

  isMoving() {
    const velocity = this.sprite.body.velocity
    return Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0
  }

  canShootBall() {
    const state = this.getCurrState().key
    return (
      state !== States.DUNK &&
      state !== States.LAYUP &&
      state !== States.SHOOTING &&
      this.hasPossession
    )
  }

  handleBallCollision() {
    if (this.game.ball.ballState === BallState.PASS) {
      if (
        this.getCurrState().key !== States.PASSING &&
        (!this.game.ball.prevPlayerWithBall || this.game.ball.prevPlayerWithBall.side === this.side)
      ) {
        // Make sure that the player who is passing can't regain posssession of the ball mid-pass
        this.getPossessionOfBall(this.game.ball.ballState)
        if (this.side === Side.PLAYER) {
          this.game.player.setSelectedCourtPlayer(this)
        }
      }
    } else if (
      this.game.ball.ballState === BallState.LOOSE ||
      this.game.ball.ballState === BallState.BLOCKED ||
      this.game.ball.ballState === BallState.STOLEN
    ) {
      // Player that is still in their shooting motion should not be able to grab their own ball
      if (this.getCurrState().key !== States.FUMBLE) {
        this.getPossessionOfBall(this.game.ball.ballState)
        if (this.side === Side.PLAYER) {
          this.game.player.setSelectedCourtPlayer(this)
        }
      }
    }
  }

  public update() {
    if (this.playerId === 'cpu1') {
      console.log(this.getCurrState().key)
    }

    this.raycastIntersectRect.setPosition(
      this.sprite.x - this.raycastIntersectRect.width / 2,
      this.sprite.y - 15
    )

    this.playerOverlapRect.setPosition(
      this.sprite.x - this.playerOverlapRect.width / 2,
      this.sprite.y + 15
    )

    this.stateText.setText(this.stateMachine.getState())
    this.stateText.setPosition(
      this.x - this.stateText.displayWidth / 2,
      this.y - 20 - this.stateText.displayHeight / 2
    )
    this.stateText.setVisible(false)

    this.playerIdText.setPosition(
      this.x - this.playerIdText.displayWidth / 2,
      this.y - 25 - this.playerIdText.displayHeight
    )
    this.isOverlapping = this.isOverlappingOtherPlayer()
  }

  isOverlappingOtherPlayer() {
    const otherPlayers = this.team.getOtherTeamCourtPlayers()
    for (let i = 0; i < otherPlayers.length; i++) {
      const courtPlayer = otherPlayers[i]

      const outputRect = new Phaser.Geom.Rectangle()
      Phaser.Geom.Intersects.GetRectangleIntersection(
        this.playerOverlapRect,
        courtPlayer.playerOverlapRect,
        outputRect
      )

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.playerOverlapRect,
          courtPlayer.playerOverlapRect
        )
      ) {
        return true
      }
    }
    return false
  }

  public getCurrState() {
    return {
      key: this.stateMachine.getState(),
      data: this.stateMachine.getFullState(),
    }
  }

  get x() {
    return this.sprite.x
  }

  get y() {
    return this.sprite.y
  }

  canMove() {
    const immovableStates: States[] = [States.SHOOTING, States.LAYUP, States.DUNK, States.PASSING]
    const state = this.getCurrState().key as States
    return !immovableStates.includes(state) && !this.game.isChangingPossession
  }

  losePossessionOfBall() {
    this.hasPossession = false
    const suffix = this.side === Side.CPU ? 'cpu' : 'player'

    if (this.getCurrState().key !== States.FUMBLE) {
      this.sprite.anims.play(`${OFFBALL_ANIMS.idle}-${suffix}`)
    }
  }

  getPossessionOfBall(prevBallState: BallState) {
    this.game.ball.blockShotFloorCollider.active = false
    this.game.ball.isRebounding = false
    this.hasPossession = true
    this.game.ball.ballState = BallState.DRIBBLING

    const suffix = this.side === Side.CPU ? 'cpu' : 'player'
    this.sprite.anims.play(`${ONBALL_ANIMS.idle}-${suffix}`)
    this.game.ball.hide()
    this.game.ball.setPosition(this.sprite.x, this.sprite.y)
    this.game.ball.sprite.setGravity(0)
    this.game.ball.playerWithBall = this
    const prevPlayerWithBall = this.game.ball.prevPlayerWithBall
    if (prevPlayerWithBall) {
      if (prevPlayerWithBall.side !== this.side) {
        this.game.handleChangePossession(prevPlayerWithBall.side)
      } else {
        // Handle possession recovery
        if (
          this.getCurrState().key === States.CHASE_REBOUND ||
          this.getCurrState().key === States.PLAYER_CONTROL
        ) {
          const notBlockOrSteal =
            prevBallState !== BallState.BLOCKED && prevBallState !== BallState.STOLEN
          this.team.handleOffensiveRebound(this.side, notBlockOrSteal)
          this.team.getOtherTeam().handleOffensiveRebound(this.side, notBlockOrSteal)
        }
      }
    }
  }

  setState(state: States, ...enterArgs: any) {
    this.stateMachine.transition(state, ...enterArgs)
  }

  stop(isDefense: boolean = false) {
    this.sprite.setVelocity(0, 0)
    this.sprite.setFlipX(false)
    const anims = this.hasPossession
      ? ONBALL_ANIMS.idle
      : isDefense
      ? OFFBALL_ANIMS.idleDefend
      : OFFBALL_ANIMS.idle
    const suffix = this.side === Side.CPU ? 'cpu' : 'player'
    this.sprite.anims.play(`${anims}-${suffix}`, true)
  }

  setVelocity(xVelocity: number, yVelocity: number) {
    this.sprite.setVelocity(xVelocity, yVelocity)
  }

  setVelocityX(xVelocity: number) {
    this.sprite.setVelocityX(xVelocity)
  }

  setVelocityY(yVelocity: number) {
    this.sprite.setVelocityY(yVelocity)
  }

  isAtPoint(moveTarget: { x: number; y: number }) {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      moveTarget.x,
      moveTarget.y
    )
    return distance <= 5
  }

  moveTowards(target: { x: number; y: number }, speed: number, isDefense: boolean = false) {
    const distance = getDistanceBetween(
      {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      {
        x: target.x,
        y: target.y,
      }
    )

    if (distance < 5) {
      this.sprite.setVelocity(0, 0)
    } else {
      let angle = Phaser.Math.Angle.BetweenPoints(
        {
          x: this.sprite.x,
          y: this.sprite.y,
        },
        {
          x: target.x,
          y: target.y,
        }
      )

      const velocityVector = new Phaser.Math.Vector2()
      this.game.physics.velocityFromRotation(angle, speed, velocityVector)
      this.playRunAnimationForVelocity(velocityVector.x, velocityVector.y, isDefense)
      this.sprite.setVelocity(velocityVector.x, velocityVector.y)
    }
  }

  playRunAnimationForVelocity(xVelocity: number, yVelocity: number, isDefense: boolean) {
    if (Math.abs(xVelocity) >= Math.abs(yVelocity)) {
      this.sprite.setFlipX(xVelocity > 0)
      const animToPlay = this.hasPossession
        ? ONBALL_ANIMS.run.left
        : isDefense
        ? OFFBALL_ANIMS.defend.left
        : OFFBALL_ANIMS.run.left
      if (this.sprite.anims.getName() !== animToPlay) {
        const suffix = this.side === Side.CPU ? 'cpu' : 'player'
        this.sprite.play(`${animToPlay}-${suffix}`, true)
      }
    } else if (Math.abs(yVelocity) > Math.abs(xVelocity)) {
      const animToPlay = this.hasPossession
        ? ONBALL_ANIMS.run.up
        : isDefense
        ? OFFBALL_ANIMS.defend.up
        : OFFBALL_ANIMS.run.up
      if (this.sprite.anims.getName() !== animToPlay) {
        const suffix = this.side === Side.CPU ? 'cpu' : 'player'
        this.sprite.play(`${animToPlay}-${suffix}`, true)
      }
    }
  }
}
