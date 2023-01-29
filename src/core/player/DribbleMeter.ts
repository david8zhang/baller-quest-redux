import Game from '~/scenes/Game'
import { Direction, Side } from '../Constants'
import { Hand } from '../CourtPlayer'
import { PlayerTeam } from './PlayerTeam'

export class DribbleMeter {
  private team: PlayerTeam
  private keyC!: Phaser.Input.Keyboard.Key
  public isDribbleButtonPressed: boolean = false
  public isWithinDribbleCombo: boolean = false
  public isCurrentlySwitchingHand: boolean = false
  public isCrossingOver: boolean = false
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
    if (!this.isCrossingOver) {
      selectedCourtPlayer.setVelocity(0, 0)
    }
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
        if (!this.isCrossingOver) {
          this.isWithinDribbleCombo = false
        }
      })
    }
  }

  handleAnimationStart(e) {
    if (e.key !== 'dribble-switch-hand-player') {
      this.isWithinDribbleCombo = false
    }
  }

  handleDribbleMove(keyCode: string) {
    if (this.isDribbleButtonPressed) {
      if (this.team.sprintMeter.isSprinting) {
        this.performCrossover(keyCode)
      } else {
        this.switchHandDribble(keyCode)
      }
    }
  }

  performCrossover(keycode: string) {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    this.isWithinDribbleCombo = true
    switch (keycode) {
      case 'ArrowLeft': {
        if (selectedCourtPlayer.handWithBall == Hand.RIGHT) {
          this.isCrossingOver = true
          this.crossover(Direction.LEFT)
        }
        break
      }
      case 'ArrowRight': {
        if (selectedCourtPlayer.handWithBall === Hand.LEFT) {
          this.isCrossingOver = true
          this.crossover(Direction.RIGHT)
        }
        break
      }
    }
  }

  crossover(direction: Direction) {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    const initialXVelocity = direction === Direction.RIGHT ? -150 : 150
    selectedCourtPlayer.sprite.anims.stop()
    selectedCourtPlayer.sprite.setFlipX(direction === Direction.RIGHT)
    selectedCourtPlayer.sprite.setTexture('crossover-start-player')
    selectedCourtPlayer.sprite.setVelocity(initialXVelocity, -10)
    Game.instance.time.delayedCall(50, () => {
      selectedCourtPlayer.sprite.setTexture('crossover-transfer-player')
      selectedCourtPlayer.sprite.setVelocity(0, 0)
      Game.instance.time.delayedCall(100, () => {
        selectedCourtPlayer.sprite.setTexture('crossover-transfer-2-player')
        Game.instance.time.delayedCall(100, () => {
          selectedCourtPlayer.handWithBall = direction === Direction.RIGHT ? Hand.RIGHT : Hand.LEFT
          selectedCourtPlayer.sprite.setTexture('crossover-finish-player')
          selectedCourtPlayer.sprite.setVelocity(-initialXVelocity, -10)
          Game.instance.time.delayedCall(100, () => {
            this.isWithinDribbleCombo = false
            this.isCrossingOver = false
          })
        })
      })
    })
  }

  switchHandDribble(keyCode: string) {
    if (this.isDribbleButtonPressed && !this.isCurrentlySwitchingHand && !this.isCrossingOver) {
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
                if (!this.isCrossingOver) {
                  this.isWithinDribbleCombo = false
                }
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
                if (!this.isCrossingOver) {
                  this.isWithinDribbleCombo = false
                }
              })
            }
          }
          break
        }
      }
    }
  }
}
