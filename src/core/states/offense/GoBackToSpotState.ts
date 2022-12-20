import { CourtPlayer } from '~/core/CourtPlayer'
import { PlayerCourtPlayer } from '~/core/player/PlayerCourtPlayer'
import { Team } from '~/core/Team'
import { State } from '../StateMachine'
import { States } from '../States'

export class GoBackToSpotState extends State {
  execute(currPlayer: CourtPlayer, team: Team) {
    const hasPossession = team.hasPossession()
    const positionToGoBackTo = hasPossession
      ? team.getOffensivePositions()
      : team.getDefensivePositions()
    const gridPosForPlayer = positionToGoBackTo[currPlayer.playerId]
    const worldPosition = team.game.court.getWorldPositionForCoordinates(
      gridPosForPlayer.row,
      gridPosForPlayer.col
    )
    if (currPlayer.isAtPoint(worldPosition)) {
      if (currPlayer.constructor.name === 'PlayerCourtPlayer') {
        const currPlayerAI = currPlayer as PlayerCourtPlayer
        currPlayerAI.isPlayerCommandOverride = false
      }
      currPlayer.setState(States.IDLE)
    } else {
      currPlayer.moveTowards(worldPosition)
    }
  }
}
