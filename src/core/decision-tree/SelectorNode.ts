import { States } from '../states/States'
import { Blackboard } from './Blackboard'
import { Decision } from './Decision'
import { TreeNode } from './TreeNode'

export class SelectorNode extends TreeNode {
  public optionA: TreeNode
  public optionB: TreeNode

  constructor(name: string, blackboard: Blackboard, optionA: TreeNode, optionB: TreeNode) {
    super(name, blackboard)
    this.optionA = optionA
    this.optionB = optionB
  }

  public process(): Decision | States {
    const status = this.optionA.process()
    if (status === Decision.STOP) {
      return this.optionB.process()
    }
    return status
  }
}
