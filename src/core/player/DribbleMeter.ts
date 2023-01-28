import Game from '~/scenes/Game'
import { Side } from '../Constants'
import { Hand } from '../CourtPlayer'
import { PlayerTeam } from './PlayerTeam'

export class DribbleMeter {
  private team: PlayerTeam
  private keyC!: Phaser.Input.Keyboard.Key
  public isDribbleButtonPressed: boolean = false
  public isWithinDribbleCombo: boolean = false
  public isCurrentlySwitchingHand: boolean = false
  public stopDribblingEvent: Phaser.Time.TimerEvent | null = null

  constructor(team: PlayerTeam) {
    this.team = team
    this.keyC = Game.instance.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    Game.instance.time.addEvent({
      repeat: -1,
      delay: 1,
      callback: () => {
        if (this.keyC.isDown) {
          this.onDribbleStart()
          this.isDribbleButtonPressed = true
        } else {
          this.isDribbleButtonPressed = false
        }
      },
    })
  }

  onDribbleStart() {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    selectedCourtPlayer.setVelocity(0, 0)
    if (!this.isWithinDribbleCombo) {
      const suffix = this.team.side === Side.PLAYER ? 'player' : 'cpu'
      selectedCourtPlayer.sprite.setFlipX(selectedCourtPlayer.handWithBall === Hand.LEFT)
      selectedCourtPlayer.sprite.anims.play(`dribble-front-${suffix}`, true)
    }
  }

  handleAnimationComplete(e) {
    if (e.key === 'dribble-switch-hand-player') {
      this.isCurrentlySwitchingHand = false
      this.stopDribblingEvent = Game.instance.time.delayedCall(250, () => {
        this.isWithinDribbleCombo = false
      })
    }
  }

  handleAnimationStart(e) {
    if (e.key !== 'dribble-switch-hand-player') {
      this.isWithinDribbleCombo = false
    }
  }

  switchHandDribble(keyCode: string) {
    if (this.isDribbleButtonPressed && !this.isCurrentlySwitchingHand) {
      this.isWithinDribbleCombo = true
      if (this.stopDribblingEvent) {
        this.stopDribblingEvent.paused = true
        this.stopDribblingEvent.destroy()
        this.stopDribblingEvent = null
      }
      const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
      switch (keyCode) {
        case 'ArrowLeft': {
          if (selectedCourtPlayer.handWithBall === Hand.RIGHT) {
            this.isCurrentlySwitchingHand = true
            selectedCourtPlayer.handWithBall = Hand.LEFT
            selectedCourtPlayer.sprite.setFlipX(false)
            selectedCourtPlayer.sprite.play('dribble-switch-hand-player', true)
          } else {
            if (!this.stopDribblingEvent) {
              this.stopDribblingEvent = Game.instance.time.delayedCall(250, () => {
                this.isWithinDribbleCombo = false
              })
            }
          }
          break
        }
        case 'ArrowRight': {
          if (selectedCourtPlayer.handWithBall === Hand.LEFT) {
            this.isCurrentlySwitchingHand = true
            selectedCourtPlayer.handWithBall = Hand.RIGHT
            selectedCourtPlayer.sprite.setFlipX(true)
            selectedCourtPlayer.sprite.play('dribble-switch-hand-player', true)
          } else {
            if (!this.stopDribblingEvent) {
              this.stopDribblingEvent = Game.instance.time.delayedCall(250, () => {
                this.isWithinDribbleCombo = false
              })
            }
          }
          break
        }
      }
    }
  }
}
