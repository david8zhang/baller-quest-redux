import Game from '~/scenes/Game'
import { LAYUP_DISTANCE, Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { DribbleToPointStateConfig } from '../states/offense/DribbleToPointState'
import { States } from '../states/States'
import { Team } from '../Team'
import { CPUConstants } from './CPUConstants'
import { CPUCourtPlayer } from './CPUCourtPlayer'
import { IsoDribble } from './plays/IsoDribble'
import { OffensePlay } from './plays/OffensePlay'
import { PickAndRoll } from './plays/PickAndRoll'
import { ScreenHandOff } from './plays/ScreenHandOff'

export class CPUTeam extends Team {
  public players: CPUCourtPlayer[] = []
  public offensePlays: OffensePlay[] = []
  public currPlay: OffensePlay | null = null
  public isPuttingBackBall: boolean = false
  public isResettingOffense: boolean = false
  public isTakingShot: boolean = false

  public defensiveAssignmentMapping: any = { ...CPUConstants.DEFENSIVE_ASSIGNMENTS }

  private reachedInitialPosAfterReboundIds: Set<string> = new Set()

  constructor(game: Game) {
    super(game, Side.CPU)
    this.setupPlayers()
    super.positionPlayers()
    this.offensePlays = [new IsoDribble(this), new ScreenHandOff(this), new PickAndRoll(this)]
  }

  public getOffensivePositions(): { [key: string]: { row: number; col: number } } {
    return CPUConstants.OFFENSE_POSITIONS_CPU
  }

  public getDefensivePositions(): { [key: string]: { row: number; col: number } } {
    return CPUConstants.DEFENSE_POSITIONS_CPU
  }

  public getCourtPlayers() {
    return this.players
  }

  public getOtherTeamCourtPlayers() {
    return this.game.player.getCourtPlayers()
  }

  public handleNewDefenseSetup(): void {
    this.currPlay = null
    Object.keys(CPUConstants.DEFENSIVE_ASSIGNMENTS).forEach((key) => {
      this.defensiveAssignmentMapping[key] = CPUConstants.DEFENSIVE_ASSIGNMENTS[key]
    })
    return
  }

  handleOffensiveRebound(side: Side, shouldResetClock: boolean) {
    if (side === Side.CPU) {
      if (shouldResetClock) {
        this.game.shotClock.reboundShotClockReset()
      }
      if (this.canPutBackBall() && !this.isPuttingBackBall) {
        this.isPuttingBackBall = true
        const ballHandler = this.game.ball.playerWithBall
        ballHandler!.setState(States.LAYUP, () => {
          ballHandler?.setState(States.IDLE)
          this.isPuttingBackBall = false
        })
      } else {
        this.isResettingOffense = true
        this.resetOffense()
      }
    } else {
      this.handleNewDefenseSetup()
    }
  }

  public getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null {
    const otherTeamPlayers = this.getOtherTeamCourtPlayers()
    const playerToDefendId = this.defensiveAssignmentMapping[playerId]
    return otherTeamPlayers.find((player) => player.playerId === playerToDefendId) || null
  }

  public canPutBackBall() {
    const ballHandler = this.game.ball.playerWithBall
    if (ballHandler && ballHandler.y > this.game.court.behindBackboardWallSprite.y) {
      const distanceToHoop = Phaser.Math.Distance.Between(
        this.game.hoop.rimSprite.x,
        this.game.hoop.rimSprite.y,
        ballHandler.sprite.x,
        ballHandler.sprite.y
      )
      return distanceToHoop < LAYUP_DISTANCE
    }
    return false
  }

  public resetOffense() {
    const handleReachedPoint = (player: CourtPlayer) => {
      this.reachedInitialPosAfterReboundIds.add(player.playerId)
      player.setState(States.IDLE)
      if (this.reachedInitialPosAfterReboundIds.size === this.players.length) {
        this.isResettingOffense = false
        this.reachedInitialPosAfterReboundIds.clear()
        this.offensePlays.forEach((play) => {
          play.reset()
        })
      }
    }

    this.players.forEach((player) => {
      const initialPos = CPUConstants.OFFENSE_POSITIONS_CPU[player.playerId]
      const worldPosForGrid = this.game.court.getWorldPositionForCoordinates(
        initialPos.row,
        initialPos.col
      )
      const dribbleToPointConfig: DribbleToPointStateConfig = {
        onReachedPointCB: () => {
          handleReachedPoint(player)
        },
        failedToReachPointCB: () => {
          handleReachedPoint(player)
        },
        timeout: 5000,
        point: worldPosForGrid,
      }
      player.setState(States.DRIBBLE_TO_POINT, dribbleToPointConfig)
    })
  }

  public getOtherTeam() {
    return this.game.player
  }

  private setupPlayers() {
    Object.keys(CPUConstants.DEFENSE_POSITIONS_CPU).forEach((key) => {
      const player = new CPUCourtPlayer(this.game, {
        position: {
          x: 0,
          y: 0,
        },
        side: Side.CPU,
        playerId: key,
        team: this,
        attributes: CPUConstants.PLAYER_STATS[key],
      })
      this.players.push(player)
      this.game.cpuCourtPlayers.add(player.sprite)
    })
  }

  public handleNewPossession() {
    super.handleNewPossession()
    this.offensePlays.forEach((play) => {
      play.reset()
    })
  }

  public getPlayerToReceiveBallOnNewPossession(): CourtPlayer {
    return this.players.find((p) => p.playerId === CPUConstants.NEW_POSSESSION_PLAYER_ID)!
  }

  public shouldDunk(): boolean {
    return false
  }

  handlePlayExecution() {
    if (!this.currPlay) {
      this.selectNextPlay()
    } else {
      if (this.currPlay.isPlayFinished) {
        this.selectNextPlay()
      } else {
        this.currPlay.execute()
      }
    }
  }

  selectNextPlay() {
    this.offensePlays.forEach((play) => {
      if (play.isPlayFinished) {
        play.reset()
      }
    })
    this.currPlay = this.offensePlays[Phaser.Math.Between(0, this.offensePlays.length - 1)]
  }

  shouldExecutePlay() {
    return (
      this.hasPossession() &&
      !this.isPuttingBackBall &&
      !this.isResettingOffense &&
      !this.isTakingShot
    )
  }

  shouldTakeShot() {
    if (this.currPlay && this.currPlay.isRunning) {
      return false
    }

    const isNotConflictingWithOtherStates =
      this.hasPossession() &&
      !this.isPuttingBackBall &&
      !this.isResettingOffense &&
      !this.isTakingShot
    if (!isNotConflictingWithOtherStates) {
      return false
    }

    const randProbability = Phaser.Math.Between(0, 100) > 50
    const playerWithBall = Game.instance.ball.playerWithBall
    if (playerWithBall) {
      let nearestDefenderDistance = Number.MAX_SAFE_INTEGER
      this.getOtherTeamCourtPlayers().forEach((player: CourtPlayer) => {
        const distance = Phaser.Math.Distance.Between(
          player.sprite.x,
          player.sprite.y,
          playerWithBall.sprite.x,
          playerWithBall.sprite.y
        )
        nearestDefenderDistance = Math.min(distance, nearestDefenderDistance)
      })
      return nearestDefenderDistance > 150 && randProbability
    }
    return false
  }

  takeShot() {
    const playerWithBall = Game.instance.ball.playerWithBall
    if (playerWithBall) {
      this.isTakingShot = true
      playerWithBall.setState(States.SHOOTING, () => {
        playerWithBall.setState(States.IDLE)
        this.isTakingShot = false
      })
    }
  }

  update() {
    if (Game.instance.isChangingPossession) {
      return
    }

    if (this.shouldTakeShot()) {
      this.takeShot()
    }

    if (this.shouldExecutePlay()) {
      this.handlePlayExecution()
    }
    this.players.forEach((p) => {
      p.update()
    })
  }
}
