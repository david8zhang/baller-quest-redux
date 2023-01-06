import { calculateShotSuccessPercentage, Side } from '~/core/Constants'
import { PlayTypes } from '~/core/cpu/plays/PlayTypes'
import { ShotCoverage } from '~/core/states/offense/ShootingState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class ShouldPassBall extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('ShouldPassBall', blackboard)
  }

  public process(): Decision | States | PlayTypes {
    const team = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    const teammates = team.getCourtPlayers()
    if (team.side === Side.PLAYER) {
      return Decision.STOP
    }

    // Check if team mates are open
    for (let i = 0; i < teammates.length; i++) {
      const teammate = teammates[i]
      const isThreePointShot = Game.instance.court.isThreePointShot(teammate.x, teammate.y)
      const shotPercentageData = calculateShotSuccessPercentage(teammate, team, isThreePointShot)
      if (
        shotPercentageData.coverage === ShotCoverage.OPEN ||
        shotPercentageData.coverage === ShotCoverage.WIDE_OPEN
      ) {
        return Decision.PROCEED
      }
    }
    return Decision.STOP
  }
}
