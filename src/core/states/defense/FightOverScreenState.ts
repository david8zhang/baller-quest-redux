import { OFFBALL_ANIMS, Side } from '~/core/Constants'
import { CourtPlayer } from '~/core/CourtPlayer'
import { Team } from '~/core/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { States } from '../States'

export enum BlockDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export class FightOverScreenState extends State {
  private static DEFENSIVE_SPACING_PERCENTAGE = 0.2
  public lastUpdatedTimestamp: number = -1

  public newDefensiveAssignment: CourtPlayer | null = null
  public didFightOverScreen: boolean = false
  public blockDirection: BlockDirection | null = null

  execute(currPlayer: CourtPlayer, team: Team) {
    const screener = team.getOtherTeamCourtPlayers().find((player: CourtPlayer) => {
      return player.getCurrState().key === States.SET_SCREEN
    })
    if (
      (currPlayer.sprite.body.blocked.left === true ||
        currPlayer.sprite.body.blocked.right === true ||
        this.blockDirection !== null) &&
      !this.didFightOverScreen
    ) {
      if (screener) {
        const posInFrontOfScreener = {
          x: screener.sprite.x,
          y: screener.sprite.y + 50,
        }

        if (!this.blockDirection) {
          this.blockDirection = currPlayer.sprite.body.blocked.left
            ? BlockDirection.LEFT
            : BlockDirection.RIGHT
        }
        if (this.blockDirection == BlockDirection.LEFT) {
          posInFrontOfScreener.x -= 30
        } else {
          posInFrontOfScreener.x += 30
        }
        if (currPlayer.isAtPoint(posInFrontOfScreener)) {
          this.didFightOverScreen = true
        } else {
          let speed = currPlayer.getDefSpeedFromAttr()
          currPlayer.moveTowards(posInFrontOfScreener, speed, true)
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

        let speed = currPlayer.getDefSpeedFromAttr()
        if (currPlayer.isAtPoint(pointToMoveTo)) {
          currPlayer.sprite.setVelocity(0, 0)
          if (Date.now() - this.lastUpdatedTimestamp > 250) {
            const suffix = currPlayer.side === Side.CPU ? 'cpu' : 'player'
            currPlayer.sprite.play(`${OFFBALL_ANIMS.idleDefend}-${suffix}`, true)
          }
        } else {
          this.lastUpdatedTimestamp = Date.now()
          currPlayer.moveTowards(pointToMoveTo, speed, true)
        }
      } else {
        currPlayer.stop(true)
      }
    }
  }

  exit(currPlayer: CourtPlayer, team: Team) {
    this.didFightOverScreen = false
    this.blockDirection = null
    this.lastUpdatedTimestamp = -1
  }
}
