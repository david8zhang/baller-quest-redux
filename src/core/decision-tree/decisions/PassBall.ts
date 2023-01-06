import { calculateShotSuccessPercentage } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { PlayTypes } from '~/core/cpu/plays/PlayTypes'
import { ShotCoverage } from '~/core/states/offense/ShootingState'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { LeafNode } from '../LeafNode'

export class PassBall extends LeafNode {
  constructor(blackboard: Blackboard) {
    super('PassBall', blackboard, States.PASSING)
  }

  public process(): Decision | States | PlayTypes {
    const team = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    const teammates = team.getCourtPlayers()

    let recipient: CourtPlayer | null = null
    let bestShotCoverage: ShotCoverage | null = null

    // Check if team mates are open
    for (let i = 0; i < teammates.length; i++) {
      const teammate = teammates[i]
      const isThreePointShot = Game.instance.court.isThreePointShot(teammate.x, teammate.y)
      const shotPercentageData = calculateShotSuccessPercentage(teammate, team, isThreePointShot)

      if (shotPercentageData.coverage === ShotCoverage.OPEN) {
        if (!recipient) {
          recipient = teammate
          bestShotCoverage = ShotCoverage.OPEN
        }
      }

      if (shotPercentageData.coverage === ShotCoverage.WIDE_OPEN) {
        if (!recipient || bestShotCoverage === ShotCoverage.OPEN) {
          recipient = teammate
          bestShotCoverage = ShotCoverage.WIDE_OPEN
        }
      }
    }
    this.blackboard.setData(BlackboardKeys.PASS_RECIPIENT, recipient)
    return super.process()
  }
}
