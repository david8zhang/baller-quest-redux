import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class HasPossession extends TreeNode {
  constructor(team: Team) {
    super('HasPossession', team)
  }

  public process(): Decision | States {
    return this.team.hasPossession() ? Decision.PROCEED : Decision.STOP
  }
}
