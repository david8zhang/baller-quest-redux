import { OFFBALL_ANIMS, Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export class DefendManState extends State {
  public lastBlockedTimestamp: number = -1
  public lastUpdatedTimestamp: number = -1
  public static DEFENSIVE_SPACING_PERCENTAGE = 0.2
  public manToDefend: CourtPlayer | null = null

  public debounceEvent: Phaser.Time.TimerEvent | null = null

  exit() {
    this.lastBlockedTimestamp = -1
    this.lastUpdatedTimestamp = -1
  }

  enter(currPlayer: CourtPlayer, team: Team) {
    this.setManToDefend(currPlayer, team)
  }

  setManToDefend(currPlayer: CourtPlayer, team: Team) {
    this.manToDefend = team.getDefensiveAssignmentForPlayer(currPlayer.playerId)
  }

  execute(currPlayer: CourtPlayer, team: Team): void {
    if (this.manToDefend) {
      const hoop = Game.instance.hoop
      const line = new Phaser.Geom.Line(
        this.manToDefend.sprite.x,
        this.manToDefend.sprite.y,
        hoop.standSprite.x,
        hoop.standSprite.y
      )
      const pointToMoveTo = line.getPoint(DefendManState.DEFENSIVE_SPACING_PERCENTAGE)
      if (currPlayer.isAtPoint(pointToMoveTo)) {
        currPlayer.sprite.setVelocity(0, 0)
        if (Date.now() - this.lastUpdatedTimestamp > 250) {
          const suffix = currPlayer.side === Side.CPU ? 'cpu' : 'player'
          currPlayer.sprite.play(`${OFFBALL_ANIMS.idle}-${suffix}`, true)
        }
      } else {
        this.lastUpdatedTimestamp = Date.now()
        currPlayer.moveTowards(pointToMoveTo, currPlayer.getDefSpeedFromAttr())
      }
    }
  }
}
