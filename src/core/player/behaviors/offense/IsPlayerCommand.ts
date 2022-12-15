import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { CourtPlayer } from '~/core/CourtPlayer'
import Game from '~/scenes/Game'
import { FriendlyPlayerAI } from '../../FriendlyPlayerAI'
import { BlackboardKeys } from '../BlackboardKeys'
import { ScreenBehavior } from './ScreenBehavior'

export class IsPlayerCommand extends BehaviorTreeNode {
  private keys: Phaser.Input.Keyboard.Key[] = []

  constructor(blackboard: Blackboard) {
    super('IsPlayerCommand', blackboard)
    this.setupKeyListeners()
  }

  setupKeyListeners() {
    FriendlyPlayerAI.KEY_COMMAND_BEHAVIORS.forEach((obj) => {
      this.keys.push(Game.instance.input.keyboard.addKey(obj.key))
    })
  }

  public process(): BehaviorStatus {
    const currentlyExecutingCommand = this.blackboard.getData(
      BlackboardKeys.PLAYER_COMMAND_TO_EXECUTE
    )
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i].isDown) {
        this.blackboard.setData(BlackboardKeys.PLAYER_COMMAND_TO_EXECUTE, this.keys[i].keyCode)
        return BehaviorStatus.SUCCESS
      }
    }
    return currentlyExecutingCommand ? BehaviorStatus.SUCCESS : BehaviorStatus.FAILURE
  }
}
