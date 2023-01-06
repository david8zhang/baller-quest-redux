import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { OffensePlay } from './OffensePlay'
import { PlayTypes } from './PlayTypes'

export class FreeLance extends OffensePlay {
  constructor(team: Team) {
    super(team, PlayTypes.FREELANCE)
  }

  public execute(): void {
    if (!this.isRunning) {
      this.isRunning = true
      Game.instance.time.delayedCall(8000, () => {
        this.terminate()
      })
    }
  }
}
