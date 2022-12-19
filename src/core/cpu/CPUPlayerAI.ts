import Game from '~/scenes/Game'
import { CourtPlayer } from '../CourtPlayer'
import { CourtPlayerAI } from '../CourtPlayerAI'
import { States } from '../states/States'
import { CPUTeam } from './CPUTeam'

export class CPUPlayerAI extends CourtPlayerAI {
  constructor(courtPlayer: CourtPlayer, cpuTeam: CPUTeam) {
    super(courtPlayer, cpuTeam)
  }

  update() {
    if (!Game.instance.isChangingPossession) {
      const nextState = this.decisionTree.process() as States
      this.stateMachine.transition(nextState)
      this.stateMachine.step()
      this.stateText.setVisible(true)
      super.update()
    } else {
      this.stateText.setVisible(false)
    }
  }
}
