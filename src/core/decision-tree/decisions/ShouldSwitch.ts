import { Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class ShouldSwitch extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('ShouldSwitch', blackboard)
  }

  public process(): Decision | States {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    const team = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    if (team.side === Side.PLAYER) {
      return Decision.STOP
    }

    const manToDefend = team.getDefensiveAssignmentForPlayer(currPlayer.playerId)
    if (manToDefend && manToDefend.hasPossession) {
      const enemyTeam = team.getOtherTeam()
      const isScreening =
        enemyTeam.getCourtPlayers().find((p) => p.getCurrState().key === States.SET_SCREEN) !==
        undefined
      return isScreening ? Decision.PROCEED : Decision.STOP
    }
    return Decision.STOP
  }
}
