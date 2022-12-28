import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export class FightOverScreenState extends State {
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2

  execute(currPlayer: CourtPlayer, team: Team) {
    const currBallHandler = team.game.ball.playerWithBall
    if (currBallHandler) {
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
  }
}
