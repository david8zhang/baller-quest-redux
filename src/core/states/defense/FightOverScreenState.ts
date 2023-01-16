import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export class FightOverScreenState extends State {
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2
  public newDefensiveAssignment: CourtPlayer | null = null
  public didFightOverScreen: boolean = false
  public isFightingAroundScreen: boolean = false

  execute(currPlayer: CourtPlayer, team: Team) {
    const screener = team.getOtherTeamCourtPlayers().find((player: CourtPlayer) => {
      return player.getCurrState().key === States.SET_SCREEN
    })

    if (
      (currPlayer.sprite.body.blocked.left === true ||
        currPlayer.sprite.body.blocked.right === true) &&
      !this.didFightOverScreen &&
      !this.isFightingAroundScreen
    ) {
      if (screener) {
        const posInFrontOfScreener = {
          x: screener.sprite.x,
          y: screener.sprite.y + 50,
        }

        if (currPlayer.sprite.body.blocked.left) {
          posInFrontOfScreener.x -= 30
        } else {
          posInFrontOfScreener.x += 30
        }
        if (currPlayer.isAtPoint(posInFrontOfScreener)) {
          this.didFightOverScreen = true
        } else {
          currPlayer.moveTowards(posInFrontOfScreener, currPlayer.getDefSpeedFromAttr() * 1.5)
        }
      }
    } else {
      const currBallHandler =
        this.newDefensiveAssignment !== null
          ? this.newDefensiveAssignment
          : team.game.ball.playerWithBall
      if (currBallHandler) {
        if (!this.newDefensiveAssignment) {
          this.newDefensiveAssignment = currBallHandler
        }
        const hoop = Game.instance.hoop
        const line = new Phaser.Geom.Line(
          this.newDefensiveAssignment.sprite.x,
          this.newDefensiveAssignment.sprite.y,
          hoop.standSprite.x,
          hoop.standSprite.y
        )
        const pointToMoveTo = line.getPoint(FightOverScreenState.DEFENSIVE_SPACING_PERCENTAGE)
        if (currPlayer.isAtPoint(pointToMoveTo)) {
          currPlayer.stop(true)
        } else {
          currPlayer.moveTowards(pointToMoveTo, currPlayer.getDefSpeedFromAttr())
        }
      } else {
        currPlayer.stop(true)
      }
    }
  }

  exit(currPlayer: CourtPlayer, team: Team) {
    this.didFightOverScreen = false
    this.isFightingAroundScreen = false
  }
}
