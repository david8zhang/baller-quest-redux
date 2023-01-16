import { Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { PlayTypes } from '~/core/cpu/plays/PlayTypes'
import { SetScreenState } from '~/core/states/offense/SetScreenState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class ShouldHelpOnDefense extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('ShouldHelpOnDefense', blackboard)
  }

  public process(): Decision | States | PlayTypes {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    const team = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    if (team.side === Side.PLAYER) {
      return Decision.STOP
    }
    const manToDefend = team.getDefensiveAssignmentForPlayer(currPlayer.playerId)
    if (manToDefend && manToDefend.getCurrState().key === States.SET_SCREEN) {
      const setScreenState = manToDefend.getCurrState().data as SetScreenState
      if (setScreenState.isAtScreenPosition) {
        if (this.ballHandlerHasOpenLane(team)) {
          return Decision.PROCEED
        }
        return Decision.STOP
      } else {
        return Decision.STOP
      }
    }
    return Decision.STOP
  }

  ballHandlerHasOpenLane(currTeam: Team) {
    const ballHandler = Game.instance.ball.playerWithBall
    const rim = Game.instance.hoop.rimSprite
    const defenders = currTeam.getCourtPlayers()

    if (ballHandler) {
      const line = new Phaser.Geom.Line(ballHandler?.sprite.x, ballHandler?.sprite.y, rim.x, rim.y)
      for (let i = 0; i < defenders.length; i++) {
        const defender = defenders[i]
        if (Phaser.Geom.Intersects.LineToRectangle(line, defender.raycastIntersectRect)) {
          return false
        }
      }
      return true
    }
    return false
  }
}
