import Game from '~/scenes/Game'
import { CourtPlayer } from '../CourtPlayer'
import { CourtPlayerAI } from '../CourtPlayerAI'
import { PlayerTeam } from './PlayerTeam'

export class FriendlyPlayerAI extends CourtPlayerAI {
  public isPlayerCommandOverride: boolean = false

  constructor(courtPlayer: CourtPlayer, playerTeam: PlayerTeam) {
    super(courtPlayer, playerTeam)
  }

  update() {
    const playerTeam = this.team as PlayerTeam
    if (
      playerTeam.getSelectedCourtPlayer() !== this.courtPlayer &&
      !Game.instance.isChangingPossession
    ) {
      if (!this.isPlayerCommandOverride) {
        const nextState = this.decisionTree.process()
        this.stateMachine.transition(nextState)
      }
      this.stateMachine.step()
      this.stateText.setVisible(true)
    } else {
      this.stateText.setVisible(false)
    }
    super.update()
  }
}
