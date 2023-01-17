import { BLOCK_LIKELIHOOD_ATTRIBUTE_MAPPING, Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class ShouldBlockShot extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('ShouldBlockShot', blackboard)
  }

  public process(): Decision | States {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    const team = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team

    if (team.side === Side.PLAYER) {
      return Decision.STOP
    }
    const otherTeamPlayers = team.getOtherTeamCourtPlayers()
    const shooter = otherTeamPlayers.find((p) => {
      return p.getCurrState().key === States.SHOOTING
    })
    if (shooter && !shooter.shotReleased) {
      const distToShooter = Phaser.Math.Distance.Between(
        currPlayer.sprite.x,
        currPlayer.sprite.y,
        shooter.sprite.x,
        shooter.sprite.y
      )

      const blockLikelihood =
        BLOCK_LIKELIHOOD_ATTRIBUTE_MAPPING[currPlayer.attributes.block.toString()]
      const randNum = Phaser.Math.Between(0, 100)

      if (distToShooter < 65 && randNum <= blockLikelihood) {
        return Decision.PROCEED
      } else {
        return Decision.STOP
      }
    }
    return Decision.STOP
  }
}
