import Game from '~/scenes/Game'
import { getClosestPlayer } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
import { DefendManState } from '../states/defense/DefendManState'
import { States } from '../states/States'
import { PlayerTeam } from './PlayerTeam'

export class DefenseMeter {
  private team: PlayerTeam
  private keyD!: Phaser.Input.Keyboard.Key
  public isDefending: boolean = false

  constructor(team: PlayerTeam) {
    this.team = team
    this.keyD = Game.instance.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    Game.instance.time.addEvent({
      repeat: -1,
      delay: 1,
      callback: () => {
        if (this.keyD.isDown) {
          this.isDefending = true
          this.defendPlayer()
        } else {
          this.isDefending = false
        }
      },
    })
  }

  getManToDefend(selectedCourtPlayer: CourtPlayer) {
    return this.team.getDefensiveAssignmentForPlayer(selectedCourtPlayer.playerId)
  }

  defendPlayer() {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    const manToDefend = this.getManToDefend(selectedCourtPlayer)
    if (
      manToDefend &&
      !this.team.hasPossession() &&
      selectedCourtPlayer.getCurrState().key !== States.CONTEST_SHOT
    ) {
      const line = new Phaser.Geom.Line(
        manToDefend.sprite.x,
        manToDefend.sprite.y,
        Game.instance.hoop.standSprite.x,
        Game.instance.hoop.standSprite.y
      )
      const pointToMoveTo = line.getPoint(DefendManState.DEFENSIVE_SPACING_PERCENTAGE)
      selectedCourtPlayer.moveTowards(
        pointToMoveTo,
        selectedCourtPlayer.getDefSpeedFromAttr(),
        true
      )
    }
  }
}
