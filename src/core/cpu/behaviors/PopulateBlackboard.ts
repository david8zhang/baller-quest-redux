import { BehaviorStatus } from '../behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '../behavior-tree/BehaviorTreeNode'
import { Blackboard } from '../behavior-tree/Blackboard'
import { CPU } from '../CPU'
import { CPUPlayerAI } from '../CPUPlayerAI'
import { BlackboardKeys } from './BlackboardKeys'

export class PopulateBlackboard extends BehaviorTreeNode {
  private cpuPlayerAI: CPUPlayerAI

  constructor(blackboard: Blackboard, cpuPlayerAI: CPUPlayerAI) {
    super('PopulateBlackboard', blackboard)
    this.cpuPlayerAI = cpuPlayerAI
  }

  public process(): BehaviorStatus {
    const allEnemyPlayers = this.cpuPlayerAI.getOtherTeamPlayers()
    const allFriendlyPlayers = this.cpuPlayerAI.getTeammates()
    this.blackboard.setData(BlackboardKeys.ENEMY_COURT_PLAYERS, allEnemyPlayers)
    this.blackboard.setData(BlackboardKeys.FRIENDLY_COURT_PLAYERS, allFriendlyPlayers)
    this.blackboard.setData(BlackboardKeys.CURR_COURT_PLAYER, this.cpuPlayerAI.courtPlayer)
    return BehaviorStatus.SUCCESS
  }
}
