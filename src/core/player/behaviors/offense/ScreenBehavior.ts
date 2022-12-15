import { BehaviorStatus } from '~/core/behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '~/core/behavior-tree/BehaviorTreeNode'
import { Blackboard } from '~/core/behavior-tree/Blackboard'
import { CourtPlayer } from '~/core/CourtPlayer'
import { BlackboardKeys } from '../BlackboardKeys'

export class ScreenBehavior extends BehaviorTreeNode {
  private timestamp: number = -1
  constructor(blackboard: Blackboard) {
    super('ScreenBehavior', blackboard)
  }

  public process(): BehaviorStatus {
    const currTimestamp = new Date().getTime()
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    if (this.timestamp === -1) {
      this.timestamp = currTimestamp
    }
    if (currTimestamp - this.timestamp < 5000) {
      currPlayer.sprite.setTint(0x0000ff)
      return BehaviorStatus.RUNNING
    }
    this.timestamp = -1
    currPlayer.sprite.clearTint()
    this.blackboard.setData(BlackboardKeys.PLAYER_COMMAND_TO_EXECUTE, null)
    return BehaviorStatus.SUCCESS
  }
}
