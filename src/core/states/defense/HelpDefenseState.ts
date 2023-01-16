import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'

export enum HelpDefenseDirection {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export class HelpDefenseState extends State {
  private newDefensiveAssignment: CourtPlayer | null = null

  execute(currPlayer: CourtPlayer, team: Team) {
    const ballHandler =
      this.newDefensiveAssignment === null
        ? Game.instance.ball.playerWithBall
        : this.newDefensiveAssignment
    if (ballHandler) {
      this.newDefensiveAssignment = ballHandler
      const helpDirection =
        ballHandler.sprite.x > Game.instance.hoop.rimSprite.x
          ? HelpDefenseDirection.RIGHT
          : HelpDefenseDirection.LEFT

      const pointToMoveTo = {
        x: ballHandler.sprite.x,
        y: ballHandler.sprite.y,
      }

      if (helpDirection === HelpDefenseDirection.LEFT) {
        pointToMoveTo.x = pointToMoveTo.x + 50
      } else {
        pointToMoveTo.x = pointToMoveTo.x - 50
      }

      if (currPlayer.isAtPoint(pointToMoveTo)) {
        currPlayer.stop()
      } else {
        currPlayer.moveTowards(pointToMoveTo, currPlayer.getDefSpeedFromAttr())
      }
    }
  }

  exit() {
    this.newDefensiveAssignment = null
  }
}
