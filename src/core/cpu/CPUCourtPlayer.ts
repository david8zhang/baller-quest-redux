import Game from '~/scenes/Game'
import { BallState } from '../Ball'
import { CourtPlayer, CourtPlayerConfig } from '../CourtPlayer'
import { BlackboardKeys } from '../decision-tree/BlackboardKeys'
import { States } from '../states/States'
import { CPUTeam } from './CPUTeam'
import { PlayTypes } from './plays/PlayTypes'

export class CPUCourtPlayer extends CourtPlayer {
  constructor(game: Game, config: CourtPlayerConfig) {
    super(game, config)
  }

  isShooting() {
    const state = this.getCurrState().key
    return state === States.LAYUP || state === States.SHOOTING || state === States.DUNK
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
      (cpuTeam.currPlay === null || cpuTeam.currPlay.playType === PlayTypes.FREELANCE) &&
      !this.isShooting() &&
      !this.isBlockingOrContesting()
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
