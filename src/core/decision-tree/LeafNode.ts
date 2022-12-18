import { States } from '../states/States'
import { Team } from '../Team'
import { Decision } from './Decision'
import { TreeNode } from './TreeNode'

export class LeafNode extends TreeNode {
  private state: States
  constructor(name: string, team: Team, state: States) {
    super(name, team)
    this.state = state
  }

  public process(): Decision | States {
    return this.state
  }
}
