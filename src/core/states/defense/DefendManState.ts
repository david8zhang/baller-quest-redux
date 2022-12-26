import { COURT_PLAYER_SPEED, OFFBALL_ANIMS } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export class DefendManState extends State {
  public manToDefend: CourtPlayer | null = null
  public lastUpdatedTimestamp: number = -1
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2
  private velocityPointCircle!: Phaser.GameObjects.Arc

  enter(currPlayer: CourtPlayer, team: Team) {
    this.manToDefend = team.getDefensiveAssignmentForPlayer(currPlayer.playerId)
    // this.velocityPointCircle = Game.instance.add.circle(0, 0, 5, 0x00ff00)
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
      const manToDefendAnim = this.manToDefend.sprite.anims.getName()
      currPlayer.moveTowards(pointToMoveTo)
      // currPlayer.sprite.anims.play(manToDefendAnim.replace('-with-ball', ''), true)
    }
  }
}
