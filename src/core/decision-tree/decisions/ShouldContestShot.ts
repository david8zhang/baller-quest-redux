import { CourtPlayer } from '~/core/CourtPlayer'
import { States } from '~/core/states/States'
import { Team } from '~/core/Team'
import { Blackboard } from '../Blackboard'
import { BlackboardKeys } from '../BlackboardKeys'
import { Decision } from '../Decision'
import { TreeNode } from '../TreeNode'

export class ShouldContestShot extends TreeNode {
  constructor(blackboard: Blackboard) {
    super('ShouldContestShot', blackboard)
  }

  public process(): Decision | States {
    const currPlayer = this.blackboard.getData(BlackboardKeys.CURR_PLAYER) as CourtPlayer
    const currTeam = this.blackboard.getData(BlackboardKeys.CURR_TEAM) as Team
    if (currPlayer.getCurrState().key === States.CONTEST_SHOT) {
      return Decision.PROCEED
    }

    const enemyPlayers = currTeam.getOtherTeamCourtPlayers()
    const shooter = enemyPlayers.find((p) => {
      const state = p.getCurrState()
      return state.key === States.SHOOTING
    })
    if (shooter) {
      const distToShooter = Phaser.Math.Distance.Between(
        shooter.sprite.x,
        shooter.sprite.y,
        currPlayer.sprite.x,
        currPlayer.sprite.y
      )
      if (distToShooter <= 150) {
        return Decision.PROCEED
      }
      return Decision.STOP
    }
    return Decision.STOP
  }
}
