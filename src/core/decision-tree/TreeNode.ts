import { States } from '../states/States'
import { Blackboard } from './Blackboard'
import { Decision } from './Decision'

export abstract class TreeNode {
  public name: string
  public blackboard: Blackboard

  constructor(name: string, blackboard: Blackboard) {
    this.name = name
    this.blackboard = blackboard
  }

  public abstract process(): Decision | States
}
