import Game from '~/scenes/Game'
import { DefendManState } from '../states/defense/DefendManState'
import { PlayerTeam } from './PlayerTeam'

export class DefenseMeter {
  private team: PlayerTeam
  private keyD!: Phaser.Input.Keyboard.Key

  constructor(team: PlayerTeam) {
    this.team = team
    this.keyD = Game.instance.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    Game.instance.time.addEvent({
      repeat: -1,
      delay: 1,
      callback: () => {
        if (this.keyD.isDown) {
          this.defendPlayer()
        }
      },
    })
  }

  defendPlayer() {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    const manToDefend = this.team.getDefensiveAssignmentForPlayer(selectedCourtPlayer.playerId)
    if (manToDefend) {
      const line = new Phaser.Geom.Line(
        manToDefend.sprite.x,
        manToDefend.sprite.y,
        Game.instance.hoop.standSprite.x,
        Game.instance.hoop.standSprite.y
      )
      const pointToMoveTo = line.getPoint(DefendManState.DEFENSIVE_SPACING_PERCENTAGE)
      selectedCourtPlayer.moveTowards(pointToMoveTo)
    }
  }
}
