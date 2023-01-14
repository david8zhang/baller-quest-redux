import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export class FightOverScreenState extends State {
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2
  public newDefensiveAssignment: CourtPlayer | null = null
  public didFightOverScreen: boolean = false

  execute(currPlayer: CourtPlayer, team: Team) {
    const currBallHandler =
      this.newDefensiveAssignment !== null
        ? this.newDefensiveAssignment
        : team.game.ball.playerWithBall
    if (currBallHandler) {
      if (!this.newDefensiveAssignment) {
        this.newDefensiveAssignment = currBallHandler
      }
      const hoop = Game.instance.hoop
      const line = new Phaser.Geom.Line(
        this.newDefensiveAssignment.sprite.x,
        this.newDefensiveAssignment.sprite.y,
        hoop.standSprite.x,
        hoop.standSprite.y
      )
      const pointToMoveTo = line.getPoint(FightOverScreenState.DEFENSIVE_SPACING_PERCENTAGE)
      if (currPlayer.isAtPoint(pointToMoveTo)) {
        currPlayer.stop(true)
      } else {
        currPlayer.moveTowards(pointToMoveTo, currPlayer.getDefSpeedFromAttr())
      }
    } else {
      currPlayer.stop(true)
    }
  }

  exit(currPlayer: CourtPlayer, team: Team) {
    if (this.newDefensiveAssignment) {
      team.updateDefensiveAssignmentMapping(
        currPlayer.playerId,
        this.newDefensiveAssignment.playerId
      )
      this.newDefensiveAssignment = null
    }
  }
}
