import Game from '~/scenes/Game'
import { CourtPlayer, CourtPlayerConfig } from '../CourtPlayer'
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

  update() {
    if (!Game.instance.isChangingPossession && this.stateMachine) {
      const team = this.team as CPUTeam
      if (team.currPlay === null && !this.isShooting()) {
        const nextState = this.decisionTree.process() as States
        if (nextState !== this.stateMachine.getState()) {
          this.stateMachine.transition(nextState)
        }
      }
      this.stateMachine.step()
      this.stateText.setVisible(true)
      super.update()
    } else {
      this.stateText.setVisible(false)
    }
  }
}
