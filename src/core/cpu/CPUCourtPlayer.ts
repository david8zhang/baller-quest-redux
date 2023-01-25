import Game from '~/scenes/Game'
import { BallState } from '../Ball'
import { CourtPlayer, CourtPlayerConfig } from '../CourtPlayer'
import { BlackboardKeys } from '../decision-tree/BlackboardKeys'
import { States } from '../states/States'
import { CPUTeam } from './CPUTeam'

export class CPUCourtPlayer extends CourtPlayer {
  constructor(game: Game, config: CourtPlayerConfig) {
    super(game, config)
  }

  isShooting() {
    const state = this.getCurrState().key
    return state === States.LAYUP || state === States.SHOOTING || state === States.DUNK
  }

  getPossessionOfBall(prevBallState: BallState): void {
    if (this.getCurrState().key === States.SET_SCREEN) {
      this.setState(States.IDLE)
    }
    super.getPossessionOfBall(prevBallState)
  }

  isBlockingOrContesting() {
    const state = this.getCurrState().key
    return state === States.BLOCK_SHOT || state === States.CONTEST_SHOT
  }

  shouldUtilizeCourtPlayerBehaviorTree(cpuTeam: CPUTeam) {
    if (Game.instance.ball.ballState === BallState.LOOSE) {
      return true
    }
    return (
      cpuTeam.currPlay === null &&
      !this.isShooting() &&
      !this.isBlockingOrContesting() &&
      this.getCurrState().key !== States.FUMBLE &&
      !cpuTeam.isPuttingBackBall &&
      !cpuTeam.isResettingOffense &&
      !cpuTeam.isTakingShot
    )
  }

  processCourtPlayerBehaviorTree() {
    const nextState = this.decisionTree.process() as States
    if (nextState !== this.stateMachine.getState()) {
      // TODO: Refactor this
      if (nextState === States.PASSING) {
        const recipient = this.blackboard.getData(BlackboardKeys.PASS_RECIPIENT) as CourtPlayer
        this.setState(nextState, recipient)
      } else {
        this.stateMachine.transition(nextState)
      }
    }
  }

  update() {
    if (!Game.instance.isChangingPossession && this.stateMachine) {
      const team = this.team as CPUTeam
      if (this.shouldUtilizeCourtPlayerBehaviorTree(team)) {
        this.processCourtPlayerBehaviorTree()
      }
      this.stateMachine.step()
      this.stateText.setVisible(true)
      super.update()
    } else {
      this.stateText.setVisible(false)
    }
  }
}
