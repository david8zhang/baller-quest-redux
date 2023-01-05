import { PlayTypes } from '../cpu/plays/PlayTypes'
import { States } from '../states/States'
import { Blackboard } from './Blackboard'
import { Decision } from './Decision'
import { TreeNode } from './TreeNode'

export class LeafNode extends TreeNode {
  private data: States | PlayTypes
  constructor(name: string, blackboard: Blackboard, data: States | PlayTypes) {
    super(name, blackboard)
    this.data = data
  }

  public process(): Decision | States | PlayTypes {
    return this.data
  }
}
