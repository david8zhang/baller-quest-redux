import Game from '~/scenes/Game'
import { Direction, Side } from '../Constants'
import { CourtPlayer, Hand } from '../CourtPlayer'
import { States } from '../states/States'
import { PlayerTeam } from './PlayerTeam'

export class DribbleMeter {
  private team: PlayerTeam
  private keyC!: Phaser.Input.Keyboard.Key
  private keyShift!: Phaser.Input.Keyboard.Key

  public isSprintButtonPressed: boolean = false
  public isDribbleButtonPressed: boolean = false
  public isWithinDribbleCombo: boolean = false
  public isCurrentlySwitchingHand: boolean = false
  public isCrossingOver: boolean = false
  public stopDribblingEvent: Phaser.Time.TimerEvent | null = null

  public dribbleArrows: Phaser.GameObjects.Image[] = []
  public pressedDribbleArrowIndex: number = 0

  constructor(team: PlayerTeam) {
    this.team = team
    this.keyC = Game.instance.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    this.keyShift = Game.instance.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    Game.instance.time.addEvent({
      repeat: -1,
      delay: 1,
      callback: () => {
        if (this.keyC.isDown) {
          this.onDribbleStart()
        } else {
          this.onDribbleEnd()
        }
      },
    })
    Game.instance.time.addEvent({
      repeat: -1,
      delay: 1,
      callback: () => {
        if (this.keyShift.isDown) {
          this.isSprintButtonPressed = true
        } else {
          this.isSprintButtonPressed = false
        }
      },
    })
  }

  displayDribbleMoveArrows() {
    if (this.dribbleArrows.length == 0) {
      const numArrows = 5
      const arrowDirections = ['arrowUp', 'arrowLeft', 'arrowRight', 'arrowDown']
      const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
      let spaceBetweenArrows = 25
      let xPos = selectedCourtPlayer.x - 49
      let yPos = selectedCourtPlayer.y + selectedCourtPlayer.sprite.displayHeight / 2 + 10
      for (let i = 0; i < numArrows; i++) {
        const randomArrow = arrowDirections[Phaser.Math.Between(0, arrowDirections.length - 1)]
        const arrow = Game.instance.add
          .sprite(xPos, yPos, randomArrow)
          .setScale(0.5)
          .setData('arrowType', randomArrow.toLowerCase())
        Game.instance.postFxPlugin.add(arrow, {
          thickness: 2,
          outlineColor: 0x000000,
        })
        this.dribbleArrows.push(arrow)
        xPos += spaceBetweenArrows
      }
    }
  }

  hideDribbleArrows() {
    this.pressedDribbleArrowIndex = 0
    this.dribbleArrows.forEach((arrow) => {
      arrow.destroy()
    })
    this.dribbleArrows = []
  }

  onDribbleEnd() {
    this.isDribbleButtonPressed = false
    this.hideDribbleArrows()
  }

  onDribbleStart() {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    selectedCourtPlayer.setVelocity(0, 0)

    if (!this.isWithinDribbleCombo && selectedCourtPlayer.getCurrState().key !== States.FUMBLE) {
      selectedCourtPlayer.sprite.anims.play('dribble-intense-player', true)
    }

    this.isDribbleButtonPressed = true
    this.displayDribbleMoveArrows()
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
    if (e.key === 'crossover-escape-player') {
      this.isCrossingOver = false
      this.isWithinDribbleCombo = false
    }
  }

  handleAnimationStart(e) {
    if (e.key !== 'dribble-switch-hand-player' && e.key !== 'crossover-escape-player') {
      this.isCrossingOver = false
      this.isWithinDribbleCombo = false
    }
  }

  handleDribbleMove(keyCode: string) {
    if (this.isDribbleButtonPressed) {
      if (this.pressedDribbleArrowIndex < this.dribbleArrows.length) {
        let arrowToPress = this.dribbleArrows[this.pressedDribbleArrowIndex]
        if (arrowToPress.getData('arrowType') === keyCode.toLowerCase()) {
          arrowToPress.setTintFill(0x00ff00)
          Game.instance.tweens.add({
            targets: [arrowToPress],
            alpha: {
              from: 1,
              to: 0,
            },
            duration: 150,
          })
          this.pressedDribbleArrowIndex++
        }
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
    selectedCourtPlayer.sprite.setTexture('crossover-player-start')
    selectedCourtPlayer.sprite.setVelocity(initialXVelocity, -10)
    Game.instance.time.delayedCall(250, () => {
      selectedCourtPlayer.sprite.setTexture('crossover-player-transition-1')
      selectedCourtPlayer.sprite.setVelocity(0, 0)
      Game.instance.time.delayedCall(150, () => {
        selectedCourtPlayer.sprite.setTexture('crossover-player-transition-2')
        Game.instance.time.delayedCall(50, () => {
          this.dropDefender(selectedCourtPlayer)
          selectedCourtPlayer.handWithBall = direction === Direction.RIGHT ? Hand.RIGHT : Hand.LEFT
          selectedCourtPlayer.sprite.setTexture('crossover-player-finish')
          this.burstSpeed(selectedCourtPlayer, initialXVelocity)
          selectedCourtPlayer.sprite.anims.play('crossover-escape-player')
        })
      })
    })
  }

  dropDefender(selectedCourtPlayer: CourtPlayer) {
    const defender = this.team.getDefenderForPlayer(selectedCourtPlayer)
    const randNum = Phaser.Math.Between(0, 100) > 90
    if (defender && defender.getCurrState().key !== States.STEAL && randNum) {
      defender.setState(States.FALL)
      Game.instance.time.delayedCall(1000, () => {
        defender.setState(States.IDLE)
      })
    }
  }

  burstSpeed(selectedCourtPlayer: CourtPlayer, xVel: number) {
    selectedCourtPlayer.sprite.setVelocity(-xVel * 3, -20)
    Game.instance.time.delayedCall(120, () => {
      selectedCourtPlayer.sprite.setVelocity(-xVel * 2, -20)
      Game.instance.time.delayedCall(50, () => {
        selectedCourtPlayer.sprite.setVelocity(-xVel * 1.5, -20)
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
