import Game from '~/scenes/Game'
import { Side } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { Team } from '../Team'
import { CPUConstants } from './CPUConstants'
import { CPUCourtPlayer } from './CPUCourtPlayer'
import { OffensePlay } from './plays/OffensePlay'
import { PickAndRoll } from './plays/PickAndRoll'
import { TakeShot } from './plays/TakeShot'

export class CPUTeam extends Team {
  public players: CPUCourtPlayer[] = []
  public offensePlays: OffensePlay[] = []
  public currPlay: OffensePlay | null = null
  public defensiveAssignmentMapping: any = { ...CPUConstants.DEFENSIVE_ASSIGNMENTS }

  constructor(game: Game) {
    super(game, Side.CPU)
    this.setupPlayers()
    super.positionPlayers()
    this.offensePlays = [new TakeShot(this)]
  }

  public getOffensivePositions(): { [key: string]: { row: number; col: number } } {
    return CPUConstants.OFFENSE_POSITIONS_CPU
  }

  public getDefensivePositions(): { [key: string]: { row: number; col: number } } {
    return CPUConstants.DEFENSE_POSITIONS_CPU
  }

  public hasPossession(): boolean {
    return this.game.ball.playerWithBall !== null && this.game.ball.playerWithBall.side === Side.CPU
  }

  public getCourtPlayers() {
    return this.players
  }

  public getOtherTeamCourtPlayers() {
    return this.game.player.getCourtPlayers()
  }

  public handleNewDefenseSetup(): void {
    this.defensiveAssignmentMapping = { ...CPUConstants.DEFENSIVE_ASSIGNMENTS }
    return
  }

  handleOffensiveRebound(side: Side, shouldResetClock: boolean) {
    if (side === Side.CPU) {
      if (shouldResetClock) {
        this.game.shotClock.resetShotClockOnNewPossession()
      }
      this.handleNewPossession()
    } else {
      this.handleNewDefenseSetup()
    }
  }

  public getDefensiveAssignmentForPlayer(playerId: string): CourtPlayer | null {
    const otherTeamPlayers = this.getOtherTeamCourtPlayers()
    const playerToDefendId = this.defensiveAssignmentMapping[playerId]
    return otherTeamPlayers.find((player) => player.playerId === playerToDefendId) || null
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
        tint: 0xff0000,
        playerId: key,
        team: this,
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

  update() {
    if (Game.instance.isChangingPossession) {
      return
    }

    if (this.hasPossession()) {
      if (!this.currPlay) {
        this.currPlay = this.offensePlays[Phaser.Math.Between(0, this.offensePlays.length - 1)]
      } else {
        this.currPlay.execute()
      }
    } else {
      this.currPlay = null
    }
    this.players.forEach((p) => {
      p.update()
    })
  }
}
