import Game from '~/scenes/Game'
import { BallState } from '../Ball'
import { BLOCK_LIKELIHOOD_ATTRIBUTE_MAPPING, getClosestPlayer, Side } from '../Constants'
import { CourtPlayer, Hand } from '../CourtPlayer'
import { Cursor } from '../Cursor'
import { PassConfig } from '../states/offense/PassingState'
import { SetScreenStateConfig } from '../states/offense/SetScreenState'
import { States } from '../states/States'
import { Team } from '../Team'
import { DefenseMeter } from './DefenseMeter'
import { DribbleMeter } from './DribbleMeter'
import { PlayerConstants } from './PlayerConstants'
import { PlayerCourtPlayer } from './PlayerCourtPlayer'
import { SprintMeter } from './SprintMeter'

export class PlayerTeam extends Team {
  private selectedCourtPlayer!: CourtPlayer
  public players: CourtPlayer[] = []
  private selectedCourtPlayerCursor: Cursor
  private passCursor: Cursor

  private keyArrowLeft!: Phaser.Input.Keyboard.Key
  private keyArrowRight!: Phaser.Input.Keyboard.Key
  private keyArrowUp!: Phaser.Input.Keyboard.Key
  private keyArrowDown!: Phaser.Input.Keyboard.Key
  public sprintMeter: SprintMeter
  public defensiveAssignmentMapping = { ...PlayerConstants.DEFENSIVE_ASSIGNMENTS }
  private defenseMeter: DefenseMeter
  private dribbleMeter: DribbleMeter
  public canCallForScreen: boolean = true

  constructor(game: Game) {
    super(game, Side.PLAYER)
    this.selectedCourtPlayerCursor = new Cursor(
      {
        position: { x: 0, y: 0 },
      },
      game
    )
    this.passCursor = new Cursor(
      {
        position: { x: 0, y: 0 },
        alpha: 0.5,
      },
      game
    )
    this.sprintMeter = new SprintMeter(game, this)
    this.defenseMeter = new DefenseMeter(this)
    this.dribbleMeter = new DribbleMeter(this)
    this.setupMovementKeys()
    this.setupKeyboardPressListener()
    this.setupPlayers()
    super.positionPlayers()
  }

  public get isDribbling() {
    return this.dribbleMeter.isDribbleButtonPressed
  }

  public get isSprinting() {
    return this.sprintMeter.isSprinting
  }

  shouldDunk() {
    return this.sprintMeter.isSprinting
  }

  setupKeyboardPressListener() {
    this.game.input.keyboard.on('keydown', (e) => {
      if (this.game.isChangingPossession) {
        return
      }
      if (e.code.includes('Arrow')) {
        this.handleArrowPress(e.code)
      } else if (e.code.includes('Digit')) {
        this.handleDigitPress(e.code)
      } else {
        switch (e.code) {
          case 'KeyS': {
            if (this.hasPossession()) {
              if (this.selectedCourtPlayer.canDunkBall()) {
                this.dunkBall()
              } else if (this.selectedCourtPlayer.canLayupBall()) {
                this.layupBall()
              } else if (this.selectedCourtPlayer.canShootBall()) {
                this.shootBall()
              }
            } else {
              if (this.canBlockShot()) {
                this.blockShot()
              } else {
                this.contestShot()
              }
            }
            break
          }
          case 'KeyX': {
            if (this.canStealBall()) {
              this.stealBall()
            }
            break
          }
          case 'KeyQ': {
            this.callForScreen()
            break
          }
          case 'Space': {
            if (this.selectedCourtPlayer.canPassBall()) {
              this.passBall()
            } else if (this.canSwitchPlayer()) {
              this.setSelectedCourtPlayer(this.passCursor.selectedCourtPlayer!)
            }
            break
          }
        }
      }
    })
  }

  handleAnimationComplete(e) {
    this.dribbleMeter.handleAnimationComplete(e)
  }

  handleAnimationStart(e) {
    this.dribbleMeter.handleAnimationStart(e)
  }

  handleArrowPress(keyCode: string) {
    this.dribbleMeter.handleDribbleMove(keyCode)
  }

  handleDigitPress(keyCode: string) {
    const numberPressed = keyCode.split('Digit')[1]
    if (numberPressed) {
      const playerToSelectId = `player${numberPressed}`
      const selectedPlayer = this.getSelectedCourtPlayer()
      if (playerToSelectId !== selectedPlayer.playerId) {
        const playerToSelect = this.getPlayerById(playerToSelectId)
        if (playerToSelect) {
          if (this.hasPossession() && !this.game.ball.isBallInFlight()) {
            this.passBall(playerToSelect)
          } else {
            this.setSelectedCourtPlayer(playerToSelect)
          }
        }
      }
    }
  }

  canStealBall() {
    const currState = this.getSelectedCourtPlayer().getCurrState().key
    return !this.hasPossession() && currState !== States.CONTEST_SHOT
  }

  stealBall() {
    if (this.selectedCourtPlayer.getCurrState().key !== States.STEAL) {
      const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
      courtPlayer.isPlayerCommandOverride = true
      this.selectedCourtPlayer.setState(States.STEAL, (player: PlayerCourtPlayer) => {
        player.setState(States.PLAYER_CONTROL)
        player.isPlayerCommandOverride = false
      })
    }
  }

  canSwitchPlayer() {
    const passingPlayer = this.getCourtPlayers().find((p) => {
      return p.getCurrState().key === States.PASSING
    })
    return passingPlayer === undefined
  }

  handleOffensiveRebound(side: Side, shouldResetClock: boolean) {
    const playerWithBall = this.game.ball.playerWithBall
    if (side === Side.PLAYER) {
      if (shouldResetClock) {
        this.game.shotClock.reboundShotClockReset()
      }
      if (playerWithBall) {
        this.setSelectedCourtPlayer(playerWithBall)
      }
      const nonBallHandlers = this.getCourtPlayers().filter((p) => p !== playerWithBall)
      nonBallHandlers.forEach((p: CourtPlayer) => {
        const playerCourtPlayer = p as PlayerCourtPlayer
        playerCourtPlayer.isPlayerCommandOverride = true
        playerCourtPlayer.setState(States.GO_BACK_TO_SPOT, () => {
          playerCourtPlayer.isPlayerCommandOverride = false
        })
      })
    } else {
      if (playerWithBall) {
        const closestPlayerToRebounder = getClosestPlayer(playerWithBall, this.getCourtPlayers())
        this.setSelectedCourtPlayer(closestPlayerToRebounder)
      }
    }
  }

  blockShot() {
    if (this.selectedCourtPlayer.getCurrState().key !== States.BLOCK_SHOT) {
      const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
      courtPlayer.isPlayerCommandOverride = true
      this.selectedCourtPlayer.setState(States.BLOCK_SHOT, (player: PlayerCourtPlayer) => {
        player.setState(States.PLAYER_CONTROL)
        player.isPlayerCommandOverride = false
      })
    }
  }

  contestShot() {
    const currState = this.selectedCourtPlayer.getCurrState().key
    if (
      currState !== States.CONTEST_SHOT &&
      currState !== States.SHOOTING &&
      currState !== States.STEAL &&
      currState !== States.BLOCK_SHOT
    ) {
      const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
      courtPlayer.isPlayerCommandOverride = true
      this.selectedCourtPlayer.setState(States.CONTEST_SHOT, (player: PlayerCourtPlayer) => {
        player.setState(States.PLAYER_CONTROL)
        player.isPlayerCommandOverride = false
      })
    }
  }

  canBlockShot() {
    const otherTeamPlayers = this.getOtherTeamCourtPlayers()
    const shooter = otherTeamPlayers.find((p) => {
      return p.getCurrState().key === States.SHOOTING || p.getCurrState().key === States.LAYUP
    })
    if (shooter && !shooter.shotReleased) {
      const selectedCourtPlayer = this.getSelectedCourtPlayer()
      const distToShooter = Phaser.Math.Distance.Between(
        selectedCourtPlayer.sprite.x,
        selectedCourtPlayer.sprite.y,
        shooter.sprite.x,
        shooter.sprite.y
      )
      const blockRating = this.selectedCourtPlayer.attributes.block
      const blockLikelihood = BLOCK_LIKELIHOOD_ATTRIBUTE_MAPPING[blockRating.toString()]
      const randNum = Phaser.Math.Between(0, 100)
      return distToShooter < 65 && randNum <= blockLikelihood
    }
    return false
  }

  layupBall() {
    const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
    courtPlayer.isPlayerCommandOverride = true
    this.selectedCourtPlayer.setState(States.LAYUP, (player: PlayerCourtPlayer) => {
      player.setState(States.PLAYER_CONTROL)
      player.isPlayerCommandOverride = false
    })
  }

  dunkBall() {
    const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
    courtPlayer.isPlayerCommandOverride = true
    this.selectedCourtPlayer.setState(States.DUNK, (player: PlayerCourtPlayer) => {
      player.setState(States.PLAYER_CONTROL)
      player.isPlayerCommandOverride = false
    })
  }

  shootBall() {
    const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
    courtPlayer.isPlayerCommandOverride = true
    this.selectedCourtPlayer.setState(States.SHOOTING, (player: PlayerCourtPlayer) => {
      player.setState(States.PLAYER_CONTROL)
      player.isPlayerCommandOverride = false
    })
  }

  getScreener() {
    let screenerPlayerId = ''
    if (this.selectedCourtPlayer.playerId === PlayerConstants.PRIMARY_SCREENER_ID) {
      screenerPlayerId = PlayerConstants.SECONDARY_SCREENER_ID
    } else {
      screenerPlayerId = PlayerConstants.PRIMARY_SCREENER_ID
    }
    return this.getCourtPlayers().find((p) => p.playerId === screenerPlayerId)!
  }

  isCurrentlyScreening() {
    const courtPlayers = this.getCourtPlayers()
    for (let i = 0; i < courtPlayers.length; i++) {
      const courtPlayer = courtPlayers[i]
      if (courtPlayer.getCurrState().key === States.SET_SCREEN) {
        return true
      }
    }
    return false
  }

  callForScreen() {
    const highlightedPlayer = this.getScreener()
    if (!this.isCurrentlyScreening() && this.hasPossession()) {
      this.players.forEach((courtPlayer: CourtPlayer) => {
        if (courtPlayer === highlightedPlayer) {
          const playerCourtPlayer = courtPlayer as PlayerCourtPlayer
          playerCourtPlayer.isPlayerCommandOverride = true
          const setScreenConfig: SetScreenStateConfig = {
            isScreeningCallback: () => {},
            onScreenFinishedCallback: () => {
              playerCourtPlayer.isPlayerCommandOverride = false
            },
          }
          courtPlayer.setState(States.SET_SCREEN, setScreenConfig)
        }
      })
    }
  }

  passBall(recipient: CourtPlayer | null = null) {
    if (this.passCursor.selectedCourtPlayer) {
      const passRecipient = recipient ? recipient : this.passCursor.selectedCourtPlayer
      // If the currently selected player has the ball, pass it. Otherwise, switch player
      if (this.selectedCourtPlayer.canPassBall()) {
        const playerCourtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
        playerCourtPlayer.isPlayerCommandOverride = true
        const passConfig: PassConfig = {
          onPassCompleteCb: (player: PlayerCourtPlayer) => {
            player.isPlayerCommandOverride = false
            this.setSelectedCourtPlayer(passRecipient)
          },
          onPassStartedCb: (player: PlayerCourtPlayer) => {},
        }
        this.selectedCourtPlayer.setState(States.PASSING, passRecipient, passConfig)
      }
    }
  }

  getOtherTeam(): Team {
    return this.game.cpu
  }

  public getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null {
    const otherTeamPlayers = this.getOtherTeamCourtPlayers()
    const playerToDefendId = this.defensiveAssignmentMapping[playerId]
    return otherTeamPlayers.find((player) => player.playerId === playerToDefendId) || null
  }

  public getOffensivePositions(): { [key: string]: { row: number; col: number } } {
    return PlayerConstants.OFFENSE_POSITIONS_PLAYER
  }

  public getDefensivePositions(): { [key: string]: { row: number; col: number } } {
    return PlayerConstants.DEFENSE_POSITIONS_PLAYER
  }

  getOtherTeamCourtPlayers() {
    return this.game.cpu.getCourtPlayers()
  }

  getCourtPlayers() {
    return this.players
  }

  setupPlayers() {
    Object.keys(PlayerConstants.OFFENSE_POSITIONS_PLAYER).forEach(
      (playerId: string, index: number) => {
        const newPlayer = new PlayerCourtPlayer(this.game, {
          position: {
            x: 0,
            y: 0,
          },
          side: Side.PLAYER,
          playerId,
          team: this,
          attributes: PlayerConstants.PLAYER_STATS[playerId],
        })
        if (index === 0) {
          this.selectedCourtPlayer = newPlayer
          this.selectedCourtPlayer.setState(States.PLAYER_CONTROL)
          this.selectedCourtPlayer.getPossessionOfBall(BallState.LOOSE)
          this.selectedCourtPlayerCursor.selectCourtPlayer(this.selectedCourtPlayer)
        }
        this.players.push(newPlayer)
        this.game.playerCourtPlayers.add(newPlayer.sprite)
      }
    )
  }

  setSelectedCourtPlayer(courtPlayer: CourtPlayer) {
    this.selectedCourtPlayer.stop()
    this.selectedCourtPlayerCursor.selectCourtPlayer(courtPlayer)
    courtPlayer.setState(States.PLAYER_CONTROL)
    this.selectedCourtPlayer = courtPlayer
  }

  public getSelectedCourtPlayer() {
    return this.selectedCourtPlayer
  }

  setupMovementKeys() {
    this.keyArrowLeft = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.keyArrowRight = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    this.keyArrowUp = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.keyArrowDown = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
  }

  handleCourtPlayerMovement() {
    if (
      !this.keyArrowLeft ||
      !this.keyArrowRight ||
      !this.keyArrowUp ||
      !this.keyArrowDown ||
      !this.selectedCourtPlayer.canMove() ||
      this.selectedCourtPlayer.getCurrState().key !== States.PLAYER_CONTROL ||
      this.defenseMeter.isDefending ||
      this.dribbleMeter.isDribbleButtonPressed
    ) {
      return
    }
    const leftDown = this.keyArrowLeft.isDown
    const rightDown = this.keyArrowRight.isDown
    const upDown = this.keyArrowUp.isDown
    const downDown = this.keyArrowDown.isDown

    let speed = this.hasPossession()
      ? this.selectedCourtPlayer.getOffSpeedFromAttr()
      : this.selectedCourtPlayer.getDefSpeedFromAttr()
    speed *= this.sprintMeter.getSpeedMultiplier()
    let velocityX = 0
    let velocityY = 0
    if (leftDown || rightDown) {
      if (leftDown && rightDown) {
        velocityX = 0
      }
      velocityX = leftDown ? -speed : speed
    } else {
      velocityX = 0
    }
    if (upDown || downDown) {
      if (upDown && downDown) {
        velocityY = 0
      }
      velocityY = upDown ? -speed : speed
    } else {
      velocityY = 0
    }
    if (velocityX == 0 && velocityY == 0) {
      this.selectedCourtPlayer.stop()
    } else {
      this.selectedCourtPlayer.setVelocityX(velocityX)
      this.selectedCourtPlayer.setVelocityY(velocityY)
      this.selectedCourtPlayer.sprite.setFlipX(velocityX > 0)
      this.selectedCourtPlayer.playRunAnimationForVelocity(velocityX, velocityY, false)
    }
  }

  public handleNewDefenseSetup(): void {
    Object.keys(PlayerConstants.DEFENSIVE_ASSIGNMENTS).forEach((key) => {
      this.defensiveAssignmentMapping[key] = PlayerConstants.DEFENSIVE_ASSIGNMENTS[key]
    })
    const playerToSelect = this.getCourtPlayers().find((p) => p.playerId === 'player1')
    this.setSelectedCourtPlayer(playerToSelect!)
    this.players.forEach((player: CourtPlayer) => {
      const courtPlayer = player as PlayerCourtPlayer
      if (player.playerId !== playerToSelect!.playerId) {
        courtPlayer.isPlayerCommandOverride = false
      }
    })
  }

  public handleNewPossession(): void {
    super.handleNewPossession()
    const playerToControl = this.getPlayerToReceiveBallOnNewPossession()
    this.setSelectedCourtPlayer(playerToControl)
    this.players.forEach((player: CourtPlayer) => {
      const courtPlayer = player as PlayerCourtPlayer
      if (player.playerId !== playerToControl.playerId) {
        courtPlayer.isPlayerCommandOverride = false
      }
    })
  }

  public getPlayerToReceiveBallOnNewPossession(): CourtPlayer {
    return this.players.find((p) => p.playerId === PlayerConstants.NEW_POSSESSION_PLAYER_ID)!
  }

  updatePassCursor() {
    const closestPlayer = getClosestPlayer(this.selectedCourtPlayer, this.getCourtPlayers())
    this.passCursor.selectCourtPlayer(closestPlayer)
  }

  getHighlightedPlayer() {
    return this.passCursor.selectedCourtPlayer
  }

  update() {
    this.selectedCourtPlayerCursor.follow()
    this.updatePassCursor()
    this.handleCourtPlayerMovement()
    this.players.forEach((p) => p.update())
  }
}
