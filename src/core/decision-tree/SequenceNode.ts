import { States } from '../states/States'
import { Blackboard } from './Blackboard'
import { Decision } from './Decision'
import { TreeNode } from './TreeNode'

export class SequenceNode extends TreeNode {
  public nodes: TreeNode[]
  constructor(name: string, blackboard: Blackboard, nodes: TreeNode[]) {
    super(name, blackboard)
    this.nodes = nodes
  }

  public process(): Decision | States {
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]
      const status = node.process()
      if (status !== Decision.PROCEED) {
        return status
      }
    }
    return Decision.PROCEED
  }
}
