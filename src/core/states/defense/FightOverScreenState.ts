import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export class FightOverScreenState extends State {
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2
  public newDefensiveAssignment: CourtPlayer | null = null

  execute(currPlayer: CourtPlayer, team: Team) {
    const currBallHandler = team.game.ball.playerWithBall
    if (currBallHandler) {
      this.newDefensiveAssignment = currBallHandler

      if (
        Math.abs(currBallHandler.sprite.body.velocity.x) > 0 ||
        Math.abs(currBallHandler.sprite.body.velocity.y) > 0
      ) {
        const hoop = Game.instance.hoop
        const line = new Phaser.Geom.Line(
          currBallHandler.sprite.x,
          currBallHandler.sprite.y,
          hoop.standSprite.x,
          hoop.standSprite.y
        )
        const pointToMoveTo = line.getPoint(FightOverScreenState.DEFENSIVE_SPACING_PERCENTAGE)
        currPlayer.moveTowards(pointToMoveTo)
      } else {
        currPlayer.stop()
      }
    } else {
      currPlayer.stop()
    }
  }

  exit(currPlayer: CourtPlayer, team: Team) {
    if (this.newDefensiveAssignment) {
      team.defensiveAssignmentMapping[currPlayer.playerId] = this.newDefensiveAssignment.playerId
      this.newDefensiveAssignment = null
    }
  }
}
