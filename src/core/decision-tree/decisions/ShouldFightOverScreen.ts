import { Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { SetScreenState } from '~/core/states/offense/SetScreenState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
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
    const hasScreener =
      team.getOtherTeamCourtPlayers().find((player) => {
        return player.getCurrState().key === States.SET_SCREEN
      }) !== undefined

    if (manToDefend && manToDefend.hasPossession && hasScreener) {
      return Decision.PROCEED
    }
    return Decision.STOP
  }
}
