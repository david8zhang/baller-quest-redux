import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { CourtPlayer } from '~/core/CourtPlayer'
import { BlackboardKeys } from './BlackboardKeys'

export class Stop extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('Stop', blackboard)
  }

  public process(): BehaviorStatus {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    currPlayer.stop()
    return BehaviorStatus.SUCCESS
  }
}
