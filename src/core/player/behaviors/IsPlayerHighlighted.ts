import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { CourtPlayer } from '~/core/CourtPlayer'
import { BlackboardKeys } from './BlackboardKeys'

export class IsPlayerHighlighted extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('IsPlayerHighlighted', blackboard)
  }

  public process(): BehaviorStatus {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    const highlightedPlayer = this.blackboard.getData(
      BlackboardKeys.HIGHLIGHTED_PLAYER
    ) as CourtPlayer
    return currPlayer === highlightedPlayer ? BehaviorStatus.SUCCESS : BehaviorStatus.FAILURE
  }
}
