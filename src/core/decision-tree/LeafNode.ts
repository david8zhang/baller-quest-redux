import { States } from '../states/States'
import { Blackboard } from './Blackboard'
import { Decision } from './Decision'
import { TreeNode } from './TreeNode'

export class LeafNode extends TreeNode {
  private state: States
  constructor(name: string, blackboard: Blackboard, state: States) {
    super(name, blackboard)
    this.state = state
  }

  public process(): Decision | States {
    return this.state
  }
}
