import Game from '~/scenes/Game'
import { BallState } from './Ball'
import {
  COURT_PLAYER_SPEED,
  getDistanceBetween,
  LAYUP_DISTANCE,
  OFFBALL_ANIMS,
  ONBALL_ANIMS,
  Side,
  SORT_ORDER,
} from './Constants'
import { createDecisionTree } from './CourtPlayerDecisionTree'
import { Blackboard } from './decision-tree/Blackboard'
import { TreeNode } from './decision-tree/TreeNode'
import { ChaseReboundState } from './states/ChaseReboundState'
import { DefendManState } from './states/defense/DefendManState'
import { FightOverScreenState } from './states/defense/FightOverScreenState'
import { SwitchDefenseState } from './states/defense/SwitchDefenseState'
import { IdleState } from './states/IdleState'
import { BlockShotState } from './states/offense/BlockShotState'
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

export interface CourtPlayerConfig {
  position: {
    x: number
    y: number
  }
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

  protected stateText: Phaser.GameObjects.Text
  protected playerIdText: Phaser.GameObjects.Text
  protected stateMachine: StateMachine
  protected team: Team
  protected decisionTree!: TreeNode
  protected blackboard: Blackboard
  protected raycastIntersectRect: Phaser.Geom.Rectangle

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
    this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle)
    this.sprite.setData('ref', this)
    this.sprite.setCollideWorldBounds(true)

    this.raycastIntersectRect = new Phaser.Geom.Rectangle(this.sprite.x, this.sprite.y, 48, 64)
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
      },
      [this, this.team]
    )
    this.stateText = Game.instance.add
      .text(this.x, this.y - 20, '', {
        fontSize: '12px',
        color: 'black',
      })
      .setDepth(SORT_ORDER.ui)
    this.playerIdText = Game.instance.add
      .text(this.x, this.stateText.y - 20, this.playerId, {
        fontSize: '12px',
        color: 'black',
      })
      .setDepth(SORT_ORDER.ui)
    this.blackboard = new Blackboard()
    this.setupDecisionTree()
  }

  canDunkBall() {
    const state = this.getCurrState().key
    return (
      !this.hasDefenderInFront() &&
      this.withinDunkOrLayupRange() &&
      this.team.shouldDunk() &&
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
    return this.hasPossession && state !== States.SHOOTING
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
        this.game.ball.prevPlayerWithBall!.side === this.side
      ) {
        // Make sure that the player who is passing can't regain posssession of the ball mid-pass
        this.getPossessionOfBall(this.game.ball.ballState)
        if (this.side === Side.PLAYER) {
          this.game.player.setSelectedCourtPlayer(this)
        }
      }
    } else if (
      this.game.ball.ballState === BallState.LOOSE ||
      this.game.ball.ballState === BallState.BLOCKED
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
    this.raycastIntersectRect.setPosition(
      this.sprite.x - this.raycastIntersectRect.width / 2,
      this.sprite.y - 15
    )

    this.stateText.setText(this.stateMachine.getState())
    this.stateText.setPosition(
      this.x - this.stateText.displayWidth / 2,
      this.y - 20 - this.stateText.displayHeight / 2
    )
    this.playerIdText.setPosition(
      this.x - this.playerIdText.displayWidth / 2,
      this.stateText.y - 20
    )
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
    this.sprite.anims.play(OFFBALL_ANIMS.idle)
  }

  getPossessionOfBall(prevBallState: BallState) {
    this.game.ball.blockShotFloorCollider.active = false
    this.game.ball.isRebounding = false
    this.hasPossession = true
    this.game.ball.ballState = BallState.DRIBBLING
    this.sprite.anims.play(ONBALL_ANIMS.idle)
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
          this.team.handleOffensiveRebound(this.side, prevBallState !== BallState.BLOCKED)
          this.team
            .getOtherTeam()
            .handleOffensiveRebound(this.side, prevBallState !== BallState.BLOCKED)
        }
      }
    }
  }

  setState(state: States, ...enterArgs: any) {
    this.stateMachine.transition(state, ...enterArgs)
  }

  stop() {
    this.sprite.setVelocity(0, 0)
    this.sprite.setFlipX(false)
    this.sprite.anims.play(this.hasPossession ? ONBALL_ANIMS.idle : OFFBALL_ANIMS.idle, true)
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

  moveTowards(target: { x: number; y: number }) {
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
      this.game.physics.velocityFromRotation(angle, COURT_PLAYER_SPEED, velocityVector)
      this.playRunAnimationForVelocity(velocityVector.x, velocityVector.y)
      this.sprite.setVelocity(velocityVector.x, velocityVector.y)
    }
  }

  playRunAnimationForVelocity(xVelocity: number, yVelocity: number) {
    if (Math.abs(xVelocity) > Math.abs(yVelocity)) {
      this.sprite.setFlipX(xVelocity > 0)
      const animToPlay = this.hasPossession ? ONBALL_ANIMS.run.left : OFFBALL_ANIMS.run.left
      if (this.sprite.anims.getName() !== animToPlay) {
        this.sprite.play(animToPlay)
      }
    } else if (Math.abs(yVelocity) > Math.abs(xVelocity)) {
      const animToPlay = this.hasPossession ? ONBALL_ANIMS.run.up : OFFBALL_ANIMS.run.up
      if (this.sprite.anims.getName() !== animToPlay) {
        this.sprite.play(animToPlay)
      }
    }
  }
}
