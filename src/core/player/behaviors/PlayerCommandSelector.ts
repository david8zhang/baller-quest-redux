import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { FriendlyPlayerAI } from '../FriendlyPlayerAI'
import { BlackboardKeys } from './BlackboardKeys'

export class PlayerCommandSelector extends BehaviorTreeNode {
  private behaviorsToSelectFrom: any = {}

  constructor(blackboard: Blackboard) {
    super('PlayerCommandSelector', blackboard)
    this.setupBehaviorsToSelectFrom()
  }

  setupBehaviorsToSelectFrom() {
    FriendlyPlayerAI.KEY_COMMAND_BEHAVIORS.forEach((obj) => {
      const Behavior = obj.behavior
      this.behaviorsToSelectFrom[obj.key] = new Behavior(this.blackboard)
    })
  }

  public process(): BehaviorStatus {
    const currCommandToExecute = this.blackboard.getData(BlackboardKeys.PLAYER_COMMAND_TO_EXECUTE)
    if (currCommandToExecute) {
      const BehaviorToExecute = this.behaviorsToSelectFrom[currCommandToExecute] as BehaviorTreeNode
      return BehaviorToExecute.tick()
    }
    return BehaviorStatus.FAILURE
  }
}
