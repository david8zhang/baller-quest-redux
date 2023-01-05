import { CourtPlayer } from '~/core/CourtPlayer'
import { Blackboard } from '~/core/decision-tree/Blackboard'
import { BlackboardKeys } from '~/core/decision-tree/BlackboardKeys'
import { Decision } from '~/core/decision-tree/Decision'
import { TreeNode } from '~/core/decision-tree/TreeNode'
import { States } from '~/core/states/States'
import Game from '~/scenes/Game'
import { PlayTypes } from '../plays/PlayTypes'

export class ShouldTakeShot extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('ShouldTakeShot', blackboard)
  }

  public process(): Decision | States | PlayTypes {
    const shotClock = Game.instance.shotClock
    const hoop = Game.instance.hoop.rimSprite

    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    const distanceToHoop = Phaser.Math.Distance.Between(hoop.x, hoop.y, currPlayer.x, currPlayer.y)

    if (shotClock.shotTimeSeconds <= 5 || distanceToHoop <= 150) {
      return Decision.PROCEED
    }
    return Decision.STOP
  }
}
