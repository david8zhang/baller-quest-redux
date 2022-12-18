import { CourtPlayer } from '../CourtPlayer'
import { PlayerTeam } from './PlayerTeam'

export class FriendlyPlayerAI {
  public courtPlayer: CourtPlayer
  private playerTeam: PlayerTeam
  constructor(courtPlayer: CourtPlayer, playerTeam: PlayerTeam) {
    this.courtPlayer = courtPlayer
    this.playerTeam = playerTeam
  }

  getTeammates() {
    return this.playerTeam.getCourtPlayers().filter((player) => {
      player != this.courtPlayer
    })
  }

  getOtherTeamPlayers() {
    return this.playerTeam.getOtherTeamCourtPlayers()
  }

  getSelectedPlayer() {
    return this.playerTeam.getSelectedCourtPlayer()
  }

  getHighlightedPlayer() {
    return this.playerTeam.getHighlightedPlayer()
  }

  update() {}
}
