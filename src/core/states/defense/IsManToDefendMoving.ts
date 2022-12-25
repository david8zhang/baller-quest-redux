import { CourtPlayer } from '~/core/CourtPlayer'
import { Blackboard } from '~/core/decision-tree/Blackboard'
import { BlackboardKeys } from '~/core/decision-tree/BlackboardKeys'
import { Decision } from '~/core/decision-tree/Decision'
import { TreeNode } from '~/core/decision-tree/TreeNode'
import { Team } from '~/core/Team'
import { States } from '../States'

export class IsManToDefendMoving extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('IsManToDefendMoving', blackboard)
  }
  public process(): Decision | States {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    const currTeam = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    const defensiveAssignment = currTeam.getDefensiveAssignmentForPlayer(currPlayer.playerId)
    if (defensiveAssignment) {
      const xVelocity = Math.abs(defensiveAssignment.sprite.body.velocity.x)
      const yVelocity = Math.abs(defensiveAssignment.sprite.body.velocity.y)
      if (xVelocity > 0 || yVelocity > 0) {
        return Decision.PROCEED
      }
      return Decision.STOP
    }
    return Decision.STOP
  }
}
