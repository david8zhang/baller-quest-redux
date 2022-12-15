import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'

export class RandomBehaviorSelector extends BehaviorTreeNode {
  constructor(blackboard: Blackboard, nodesToSelectFrom: BehaviorTreeNode[]) {
    super('RandomBehaviorSelector', blackboard)
  }

  public process(): BehaviorStatus {
    return BehaviorStatus.SUCCESS
  }
}
