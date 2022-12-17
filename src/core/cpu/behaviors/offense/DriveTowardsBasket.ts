import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'

export class DriveTowardsBasket extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('DriveTowardsBasket', blackboard)
  }

  public process(): BehaviorStatus {
    return BehaviorStatus.SUCCESS
  }
}
