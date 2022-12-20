import { CourtPlayer } from '../CourtPlayer'
import { States } from '../states/States'
import { Team } from '../Team'
import { Blackboard } from './Blackboard'
import { BlackboardKeys } from './BlackboardKeys'
import { Decision } from './Decision'
import { TreeNode } from './TreeNode'

export class PopulateBlackboard extends TreeNode {
  private courtPlayer: CourtPlayer
  private team: Team

  constructor(blackboard: Blackboard, currPlayer: CourtPlayer, team: Team) {
    super('PopulateBlackboard', blackboard)
    this.courtPlayer = currPlayer
    this.team = team
  }

  public process(): Decision | States {
    this.blackboard.setData(BlackboardKeys.CURR_PLAYER, this.courtPlayer)
    this.blackboard.setData(BlackboardKeys.CURR_TEAM, this.team)
    return Decision.PROCEED
  }
}
