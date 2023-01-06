import { BallState } from '~/core/Ball'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class HasPossession extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('HasPossession', blackboard)
  }

  public process(): Decision | States {
    const team = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    return team.hasPossession() ? Decision.PROCEED : Decision.STOP
  }
}
