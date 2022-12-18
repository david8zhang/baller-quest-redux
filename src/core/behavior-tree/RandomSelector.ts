import { BehaviorStatus } from './BehaviorStatus'
import { BehaviorTreeNode } from './BehaviorTreeNode'
import { Blackboard } from './Blackboard'

export class RandomSelector extends BehaviorTreeNode {
  public nodes: BehaviorTreeNode[]
  constructor(name: string, blackboard: Blackboard, nodes: BehaviorTreeNode[]) {
    super(name, blackboard)
    this.nodes = nodes
  }

  public process(): BehaviorStatus {
    const randomBehavior = this.nodes[Phaser.Math.Between(0, this.nodes.length - 1)]
    randomBehavior.tick()
    return BehaviorStatus.SUCCESS
  }
}
