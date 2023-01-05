import { Blackboard } from '~/core/decision-tree/Blackboard'
import { Decision } from '~/core/decision-tree/Decision'
import { TreeNode } from '~/core/decision-tree/TreeNode'
import { States } from '~/core/states/States'
import { PlayTypes } from '../plays/PlayTypes'

export class RandomSelector extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('RandomSelector', blackboard)
  }

  public process(): Decision | States | PlayTypes {
    const allPlayTypes = [PlayTypes.PICK_AND_ROLL, PlayTypes.SCREEN_HAND_OFF]
    return allPlayTypes[Phaser.Math.Between(0, allPlayTypes.length - 1)]
  }
}
