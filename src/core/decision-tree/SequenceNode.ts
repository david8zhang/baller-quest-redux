import { States } from '../states/States'
import { Team } from '../Team'
import { Decision } from './Decision'
import { TreeNode } from './TreeNode'

export class SequenceNode extends TreeNode {
  public nodes: TreeNode[]
  constructor(name: string, team: Team, nodes: TreeNode[]) {
    super(name, team)
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
