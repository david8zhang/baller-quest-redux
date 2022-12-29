import { COURT_PLAYER_SPEED, getClosestPlayer, OFFBALL_ANIMS } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class DefendManState extends State {
  public lastUpdatedTimestamp: number = -1
  public static DEFENSIVE_SPACING_PERCENTAGE = 0.2
  public manToDefend: CourtPlayer | null = null

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
      if (
        this.manToDefend.sprite.body.velocity.x === 0 &&
        this.manToDefend.sprite.body.velocity.y === 0
      ) {
        currPlayer.stop()
      } else {
        const pointToMoveTo = line.getPoint(DefendManState.DEFENSIVE_SPACING_PERCENTAGE)
        currPlayer.moveTowards(pointToMoveTo)
      }
    }
  }
}
