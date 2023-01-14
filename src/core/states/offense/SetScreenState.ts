import { Direction, Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export enum ScreenDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface SetScreenStateConfig {
  isScreeningCallback: Function
  onScreenFinishedCallback: Function
  screenTargetPlayer?: CourtPlayer
}

export class SetScreenState extends State {
  public startedScreenTimestamp = -1
  public static SCREEN_DURATION = 5000
  public static BLOCK_DURATION = 1000
  public static TRAVEL_DURATION = 3000

  public isScreeningCallback: Function | null = null
  public onScreenFinishedCallback: Function | null = null
  public screenTarget: CourtPlayer | null = null
  public screenPosition: { x: number; y: number } | null = null
  public screenDirection!: ScreenDirection
  public isAtScreenPosition: boolean = false
  private travelTimeExpired: boolean = false
  private screenCollider!: Phaser.Physics.Arcade.Collider

  enter(currPlayer: CourtPlayer, team: Team, config: SetScreenStateConfig) {
    this.isScreeningCallback = config.isScreeningCallback
    this.onScreenFinishedCallback = config.onScreenFinishedCallback
    if (config.screenTargetPlayer) {
      this.screenTarget = config.screenTargetPlayer
    }

    // Turn on screen collider
    const otherPlayers =
      currPlayer.side === Side.PLAYER
        ? Game.instance.cpuCourtPlayers
        : Game.instance.playerCourtPlayers
    this.screenCollider = Game.instance.physics.add.collider(currPlayer.sprite, otherPlayers)
    this.screenCollider.active = false
  }

  execute(currPlayer: CourtPlayer, team: Team) {
    if (this.startedScreenTimestamp != -1) {
      const currTimestamp = Date.now()
      if (this.screenPosition) {
        if (currPlayer.isAtPoint(this.screenPosition) || this.travelTimeExpired) {
          this.screenCollider.active = true
          this.isAtScreenPosition = true
          if (this.isScreeningCallback) {
            this.isScreeningCallback()
          }
          currPlayer.stop()
          // If the player is at the screen position for longer than the screen duration
          if (currTimestamp - this.startedScreenTimestamp > SetScreenState.SCREEN_DURATION) {
            currPlayer.setState(States.GO_BACK_TO_SPOT, this.onScreenFinishedCallback)
          }
        } else {
          if (!currPlayer.sprite.body.touching.none) {
            if (currTimestamp - this.startedScreenTimestamp > SetScreenState.BLOCK_DURATION) {
              this.travelTimeExpired = true
              currPlayer.stop()
            }
          } else {
            if (currTimestamp - this.startedScreenTimestamp > SetScreenState.TRAVEL_DURATION) {
              this.travelTimeExpired = true
              currPlayer.stop
            }
          }
        }
      }
    } else {
      const screenTarget = this.screenTarget ? this.screenTarget : Game.instance.ball.playerWithBall
      if (screenTarget) {
        this.startedScreenTimestamp = Date.now()
        const direction =
          currPlayer.sprite.x >= screenTarget?.sprite.x
            ? ScreenDirection.RIGHT
            : ScreenDirection.LEFT
        this.screenDirection = direction
        const defenderForBallHandler = team.getDefenderForPlayer(screenTarget)
        if (defenderForBallHandler) {
          if (!this.screenPosition) {
            this.screenPosition = {
              x:
                direction === ScreenDirection.RIGHT
                  ? defenderForBallHandler.sprite.x + 40
                  : defenderForBallHandler.sprite.x - 40,
              y: defenderForBallHandler.sprite.y + 5,
            }
          }
          currPlayer.moveTowards(this.screenPosition, currPlayer.getOffSpeedFromAttr())
        }
      }
    }
  }

  exit() {
    if (this.screenCollider) {
      this.screenCollider.destroy()
    }
    this.travelTimeExpired = false
    this.isAtScreenPosition = false
    this.startedScreenTimestamp = -1
    this.screenPosition = null
  }
}
