import { getClosestPlayer } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class SwitchDefenseState extends State {
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2
  execute(currPlayer: CourtPlayer, team: Team) {
    const enemyTeam = team.getOtherTeam()
    const screeners = enemyTeam.getCourtPlayers().filter((player) => {
      return player.getCurrState().key === States.SET_SCREEN
    })
    if (screeners.length > 0) {
      const screener = getClosestPlayer(currPlayer, screeners)
      if (
        screener &&
        screener.sprite.body.velocity.x == 0 &&
        screener.sprite.body.velocity.y === 0
      ) {
        const hoop = Game.instance.hoop
        const line = new Phaser.Geom.Line(
          screener.sprite.x,
          screener.sprite.y,
          hoop.standSprite.x,
          hoop.standSprite.y
        )
        const pointToMoveTo = line.getPoint(SwitchDefenseState.DEFENSIVE_SPACING_PERCENTAGE)
        if (currPlayer.isAtPoint(pointToMoveTo)) {
          currPlayer.stop()
        } else {
          currPlayer.moveTowards(pointToMoveTo)
        }
      }
    }
  }
}
