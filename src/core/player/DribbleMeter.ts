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
  public isCrossingOver: boolean = false
  public stopDribblingEvent: Phaser.Time.TimerEvent | null = null

  public dribbleArrows: Phaser.GameObjects.Image[] = []
  public pressedDribbleArrowIndex: number = 0
  public dribbleComboSuccess: boolean = false

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
    this.setupKeyboardListener()
  }

  setupKeyboardListener() {
    Game.instance.input.keyboard.on('keydown', (e) => {
      switch (e.code) {
        case 'KeyX': {
          if (
            this.dribbleComboSuccess &&
            this.isDribbleButtonPressed &&
            this.team.hasPossession()
          ) {
            this.performCrossover()
            break
          }
        }
      }
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
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    selectedCourtPlayer.auraSprite.setVisible(false)
  }

  onDribbleStart() {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()

    if (!this.isCrossingOver) {
      selectedCourtPlayer.setVelocity(0, 0)
    }

    if (!this.isWithinDribbleCombo && selectedCourtPlayer.getCurrState().key !== States.FUMBLE) {
      selectedCourtPlayer.sprite.anims.play('dribble-intense-player', true)
    }

    this.isDribbleButtonPressed = true
    this.displayDribbleMoveArrows()
  }

  handleAnimationComplete(e) {
    if (e.key === 'dribble-intense-player') {
      this.isWithinDribbleCombo = false
      this.dribbleComboSuccess = false
    }
    if (e.key === 'crossover-escape-player') {
      this.isCrossingOver = false
      this.isWithinDribbleCombo = false
      this.dribbleComboSuccess = false
    }
  }

  handleAnimationStart(e) {
    if (e.key !== 'dribble-switch-hand-player' && e.key !== 'crossover-escape-player') {
      this.isCrossingOver = false
      this.isWithinDribbleCombo = false
    }
  }

  onDribbleComboSuccess() {
    const selectedCourtPlayer = this.team.getSelectedCourtPlayer()
    selectedCourtPlayer.auraSprite
      .setPosition(selectedCourtPlayer.x, selectedCourtPlayer.y)
      .setVisible(true)
      .setDepth(selectedCourtPlayer.sprite.depth - 1)
    selectedCourtPlayer.auraSprite.play('aura')
    this.dribbleComboSuccess = true
    Game.instance.time.delayedCall(1500, () => {
      this.dribbleComboSuccess = false
    })
  }

  onDribbleComboFailed() {
    this.pressedDribbleArrowIndex = 0
    this.hideDribbleArrows()
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
            onComplete: () => {
              if (this.pressedDribbleArrowIndex === this.dribbleArrows.length) {
                this.onDribbleComboSuccess()
              }
            },
          })
          this.pressedDribbleArrowIndex++
        } else {
          arrowToPress.setTintFill(0xff0000)
          Game.instance.tweens.add({
            targets: [arrowToPress],
            alpha: {
              from: 1,
              to: 0,
            },
            duration: 150,
            onComplete: () => {
              this.onDribbleComboFailed()
            },
          })
        }
      }
    }
  }

  performCrossover() {
    const direction = Phaser.Math.Between(0, 1) === 0 ? Direction.LEFT : Direction.RIGHT
    this.isWithinDribbleCombo = true
    this.isCrossingOver = true
    this.crossover(direction)
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
    if (defender && defender.getCurrState().key !== States.STEAL) {
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
}
