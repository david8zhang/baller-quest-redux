import { CourtPlayer } from '~/core/CourtPlayer'
import { BehaviorStatus } from '../../behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '../../behavior-tree/BehaviorTreeNode'
import { Blackboard } from '../../behavior-tree/Blackboard'
import { DEFENSIVE_ASSIGNMENTS } from '../../CPUConstants'
import { BlackboardKeys } from '../BlackboardKeys'

export class GetManToDefend extends BehaviorTreeNode {
  constructor(blackboard: Blackboard) {
    super('GetManToDefend', blackboard)
  }

  public process(): BehaviorStatus {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    const otherTeamPlayers = this.blackboard.getData(
      BlackboardKeys.ENEMY_COURT_PLAYERS
    ) as CourtPlayer[]
    const playerToDefendId = DEFENSIVE_ASSIGNMENTS[currPlayer.playerId]
    const playerToDefend = otherTeamPlayers.find((p) => p.playerId === playerToDefendId)
    if (!playerToDefend) {
      return BehaviorStatus.FAILURE
    }
    this.blackboard.setData(BlackboardKeys.CURR_DEFENSIVE_ASSIGNMENT, playerToDefend)
    return BehaviorStatus.SUCCESS
  }
}
