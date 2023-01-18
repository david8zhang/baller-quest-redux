import { OFFBALL_ANIMS, Side } from '~/core/Constants'
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
  public lastUpdatedTimestamp: number = -1

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
        currPlayer.sprite.setVelocity(0, 0)
        if (Date.now() - this.lastUpdatedTimestamp > 250) {
          const suffix = currPlayer.side === Side.CPU ? 'cpu' : 'player'
          currPlayer.sprite.play(`${OFFBALL_ANIMS.idleDefend}-${suffix}`, true)
        }
      } else {
        this.lastUpdatedTimestamp = Date.now()
        let speed = currPlayer.getDefSpeedFromAttr()
        currPlayer.moveTowards(pointToMoveTo, speed, true)
      }
    }
  }

  exit() {
    this.newDefensiveAssignment = null
    this.lastUpdatedTimestamp = -1
  }
}
