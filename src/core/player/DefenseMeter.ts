import Game from '~/scenes/Game'
import { getClosestPlayer } from '../Constants'
import { CourtPlayer } from '../CourtPlayer'
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

  getManToDefend(selectedCourtPlayer: CourtPlayer) {
    return getClosestPlayer(selectedCourtPlayer, this.team.getOtherTeamCourtPlayers())
  }

  defendPlayer() {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    const manToDefend = this.getManToDefend(selectedCourtPlayer)

    // const manToDefend = this.team.getDefensiveAssignmentForPlayer(selectedCourtPlayer.playerId)
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
