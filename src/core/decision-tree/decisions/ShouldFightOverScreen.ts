import { Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { SetScreenState } from '~/core/states/offense/SetScreenState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class ShouldFightOverScreen extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('ShouldFightOverScreen', blackboard)
  }

  public process(): Decision | States {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    const team = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    if (team.side === Side.PLAYER) {
      return Decision.STOP
    }

    const manToDefend = team.getDefensiveAssignmentForPlayer(currPlayer.playerId)
    if (manToDefend && manToDefend.getCurrState().key === States.SET_SCREEN) {
      const state = manToDefend.getCurrState().data as SetScreenState
      if (state.isAtScreenPosition) {
        return Decision.PROCEED
      }
      return Decision.STOP
    }
    return Decision.STOP
  }
}
