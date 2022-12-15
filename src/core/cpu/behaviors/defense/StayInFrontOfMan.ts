import { CourtPlayer, CourtPlayerState } from '~/core/CourtPlayer'
import Game from '~/scenes/Game'
import { BehaviorStatus } from '../../../behavior-tree/BehaviorStatus'
import { BehaviorTreeNode } from '../../../behavior-tree/BehaviorTreeNode'
import { Blackboard } from '../../../behavior-tree/Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'

export class StayInFrontOfMan extends BehaviorTreeNode {
  public static DEFENSIVE_SPACING_PERCENTAGE = 0.2

  constructor(blackboard: Blackboard) {
    super('StayInFrontOfMan', blackboard)
  }

  public process(): BehaviorStatus {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_COURT_PLAYER) as CourtPlayer
    if (currPlayer.state !== CourtPlayerState.IDLE) {
      return BehaviorStatus.FAILURE
    }
    const hoop = Game.instance.hoop
    const defensiveAssignment = this.blackboard.getData(
      BlackboardKeys.CURR_DEFENSIVE_ASSIGNMENT
    ) as CourtPlayer
    const line = new Phaser.Geom.Line(
      defensiveAssignment.x,
      defensiveAssignment.y,
      hoop.standSprite.x,
      hoop.standSprite.y
    )
    const pointToMoveTo = line.getPoint(StayInFrontOfMan.DEFENSIVE_SPACING_PERCENTAGE)
    currPlayer.moveTowards(pointToMoveTo)
    if (
      currPlayer.isAtPoint(pointToMoveTo) ||
      defensiveAssignment.state === CourtPlayerState.SHOOTING
    ) {
      currPlayer.stop()
      return BehaviorStatus.SUCCESS
    }
    return BehaviorStatus.RUNNING
  }
}
