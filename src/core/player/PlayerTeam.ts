import Game from '~/scenes/Game'
import { getClosestPlayer, Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { Cursor } from '../Cursor'
import { SetScreenStateConfig } from '../states/offense/SetScreenState'
import { States } from '../states/States'
import { Team } from '../Team'
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
  private sprintMeter: SprintMeter

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
    this.sprintMeter = new SprintMeter(game)
    this.setupMovementKeys()
    this.setupKeyboardPressListener()
    this.setupPlayers()
    super.positionPlayers()
  }

  shouldDunk() {
    return this.sprintMeter.isSprinting
  }

  setupKeyboardPressListener() {
    this.game.input.keyboard.on('keydown', (e) => {
      switch (e.code) {
        case 'KeyS': {
          if (this.selectedCourtPlayer.canDunkBall()) {
            this.dunkBall()
          } else if (this.selectedCourtPlayer.canLayupBall()) {
            this.layupBall()
          } else if (this.selectedCourtPlayer.canShootBall()) {
            this.shootBall()
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
          } else {
            this.setSelectedCourtPlayer(this.passCursor.selectedCourtPlayer!)
          }
          break
        }
      }
    })
  }

  layupBall() {
    const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
    courtPlayer.isPlayerCommandOverride = true
    this.selectedCourtPlayer.setState(States.LAYUP, (player: PlayerCourtPlayer) => {
      player.isPlayerCommandOverride = false
    })
  }

  dunkBall() {
    const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
    courtPlayer.isPlayerCommandOverride = true
    this.selectedCourtPlayer.setState(States.DUNK, (player: PlayerCourtPlayer) => {
      player.isPlayerCommandOverride = false
    })
  }

  shootBall() {
    const courtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
    courtPlayer.isPlayerCommandOverride = true
    this.selectedCourtPlayer.setState(States.SHOOTING, (player: PlayerCourtPlayer) => {
      player.isPlayerCommandOverride = false
    })
  }

  callForScreen() {
    const highlightedPlayer = this.getHighlightedPlayer()
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

  passBall() {
    if (this.passCursor.selectedCourtPlayer) {
      const passRecipient = this.passCursor.selectedCourtPlayer
      // If the currently selected player has the ball, pass it. Otherwise, switch player
      if (this.selectedCourtPlayer.canPassBall()) {
        const playerCourtPlayer = this.selectedCourtPlayer as PlayerCourtPlayer
        playerCourtPlayer.isPlayerCommandOverride = true
        this.selectedCourtPlayer.setState(
          States.PASSING,
          this.passCursor.selectedCourtPlayer,
          (player: PlayerCourtPlayer) => {
            player.isPlayerCommandOverride = false
            this.setSelectedCourtPlayer(passRecipient)
          }
        )
      }
    }
  }

  getOtherTeam(): Team {
    return this.game.cpu
  }

  public getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null {
    const otherTeamPlayers = this.getOtherTeamCourtPlayers()
    const playerToDefendId = PlayerConstants.DEFENSIVE_ASSIGNMENTS[playerId]
    return otherTeamPlayers.find((player) => player.playerId === playerToDefendId) || null
  }

  public getOffensivePositions(): { [key: string]: { row: number; col: number } } {
    return PlayerConstants.OFFENSE_POSITIONS_PLAYER
  }

  public getDefensivePositions(): { [key: string]: { row: number; col: number } } {
    return PlayerConstants.DEFENSE_POSITIONS_PLAYER
  }

  public hasPossession(): boolean {
    return (
      this.game.ball.playerWithBall !== null && this.game.ball.playerWithBall.side === Side.PLAYER
    )
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
          // tint: 0x00ff00,
          playerId,
          team: this,
        })
        if (index === 0) {
          this.selectedCourtPlayer = newPlayer
          this.selectedCourtPlayer.getPossessionOfBall()
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
    this.selectedCourtPlayer = courtPlayer
  }

  getSelectedCourtPlayer() {
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
      !this.selectedCourtPlayer.canMove()
    ) {
      return
    }
    const leftDown = this.keyArrowLeft.isDown
    const rightDown = this.keyArrowRight.isDown
    const upDown = this.keyArrowUp.isDown
    const downDown = this.keyArrowDown.isDown

    const speed = this.sprintMeter.getSpeed()
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
      this.selectedCourtPlayer.playRunAnimationForVelocity(velocityX, velocityY)
    }
  }

  public handleNewDefenseSetup(): void {
    const playerToSelect = this.getCourtPlayers().find((p) => p.playerId === 'player1')
    this.setSelectedCourtPlayer(playerToSelect!)
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
