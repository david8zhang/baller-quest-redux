import { CourtPlayer } from '~/core/CourtPlayer'
import { CourtPlayerAI } from '~/core/CourtPlayerAI'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export class DefendManState extends State {
  public manToDefend: CourtPlayer | null = null
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2

  enter(currPlayer: CourtPlayerAI, team: Team) {
    const courtPlayer = currPlayer.courtPlayer
    this.manToDefend = team.getDefensiveAssignmentForPlayer(courtPlayer.playerId)
  }

  execute(currPlayer: CourtPlayerAI): void {
    if (this.manToDefend) {
      const hoop = Game.instance.hoop
      const line = new Phaser.Geom.Line(
        this.manToDefend.sprite.x,
        this.manToDefend.sprite.y,
        hoop.standSprite.x,
        hoop.standSprite.y
      )
      const pointToMoveTo = line.getPoint(DefendManState.DEFENSIVE_SPACING_PERCENTAGE)
      currPlayer.courtPlayer.moveTowards(pointToMoveTo)
    }
  }
}
