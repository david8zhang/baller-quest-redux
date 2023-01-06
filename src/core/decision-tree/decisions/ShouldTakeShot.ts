import { calculateShotSuccessPercentage, Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { PlayTypes } from '~/core/cpu/plays/PlayTypes'
import { ShotCoverage } from '~/core/states/offense/ShootingState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class ShouldTakeShot extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('ShouldTakeShot', blackboard)
  }

  public process(): Decision | States | PlayTypes {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    const team = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    if (team.side === Side.PLAYER) {
      return Decision.STOP
    }

    const isThreePointShot = Game.instance.court.isThreePointShot(currPlayer.x, currPlayer.y)
    const shotSuccessData = calculateShotSuccessPercentage(currPlayer, team, isThreePointShot)
    return shotSuccessData.coverage === ShotCoverage.WIDE_OPEN ||
      shotSuccessData.coverage === ShotCoverage.OPEN
      ? Decision.PROCEED
      : Decision.STOP
  }
}
