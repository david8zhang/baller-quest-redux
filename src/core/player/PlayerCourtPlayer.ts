import Game from '~/scenes/Game'
import { CourtPlayer, CourtPlayerConfig } from '../CourtPlayer'
import { PlayerTeam } from './PlayerTeam'

export class PlayerCourtPlayer extends CourtPlayer {
  public isPlayerCommandOverride: boolean = false

  constructor(game: Game, config: CourtPlayerConfig) {
    super(game, config)
  }

  update() {
    const playerTeam = this.team as PlayerTeam
    if (playerTeam.getSelectedCourtPlayer() !== this && !Game.instance.isChangingPossession) {
      if (!this.isPlayerCommandOverride) {
        const nextState = this.decisionTree.process()
        this.stateMachine.transition(nextState)
      }
      this.stateMachine.step()
    }
    this.stateText.setVisible(true)
    super.update()
  }
}
