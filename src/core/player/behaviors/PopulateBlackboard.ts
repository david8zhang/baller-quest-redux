import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { FriendlyPlayerAI } from '../FriendlyPlayerAI'
import { BlackboardKeys } from './BlackboardKeys'

export class PopulateBlackboard extends BehaviorTreeNode {
  private friendlyPlayerAI: FriendlyPlayerAI
  constructor(blackboard: Blackboard, friendlyPlayerAI: FriendlyPlayerAI) {
    super('PopulateBlackboard', blackboard)
    this.friendlyPlayerAI = friendlyPlayerAI
  }

  public process(): BehaviorStatus {
    const currCourtPlayer = this.friendlyPlayerAI.courtPlayer
    this.blackboard.setData(BlackboardKeys.CURR_COURT_PLAYER, currCourtPlayer)
    this.blackboard.setData(
      BlackboardKeys.HIGHLIGHTED_PLAYER,
      this.friendlyPlayerAI.getHighlightedPlayer()
    )
    return BehaviorStatus.SUCCESS
  }
}
