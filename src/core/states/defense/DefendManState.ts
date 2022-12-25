import { COURT_PLAYER_SPEED, OFFBALL_ANIMS } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class DefendManState extends State {
  public manToDefend: CourtPlayer | null = null
  public reachedPointTimestamp: number = -1
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2

  enter(currPlayer: CourtPlayer, team: Team) {
    this.manToDefend = team.getDefensiveAssignmentForPlayer(currPlayer.playerId)
  }

  execute(currPlayer: CourtPlayer): void {
    if (this.manToDefend) {
      const hoop = Game.instance.hoop
      const line = new Phaser.Geom.Line(
        this.manToDefend.sprite.x,
        this.manToDefend.sprite.y,
        hoop.standSprite.x,
        hoop.standSprite.y
      )
      const pointToMoveTo = line.getPoint(DefendManState.DEFENSIVE_SPACING_PERCENTAGE)
      currPlayer.moveTowards(pointToMoveTo)
    }
  }
}
