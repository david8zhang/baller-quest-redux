import { BehaviorTreeNode } from '../behavior-tree/BehaviorTreeNode'
import { Blackboard } from '../behavior-tree/Blackboard'
import { SelectorNode } from '../behavior-tree/SelectorNode'
import { SequenceNode } from '../behavior-tree/SequenceNode'
import { CourtPlayer } from '../CourtPlayer'
import { IsPlayerCommand } from './behaviors/offense/IsPlayerCommand'
import { IsPlayerHighlighted } from './behaviors/offense/IsPlayerHighlighted'
import { PlayerCommandSelector } from './behaviors/offense/PlayerCommandSelector'
import { RandomBehaviorSelector } from './behaviors/offense/RandomBehaviorSelector'
import { ScreenBehavior } from './behaviors/offense/ScreenBehavior'
import { PopulateBlackboard } from './behaviors/PopulateBlackboard'
import { Player } from './Player'

export class FriendlyPlayerAI {
  public static KEY_COMMAND_BEHAVIORS = [
    {
      key: Phaser.Input.Keyboard.KeyCodes.Q,
      behavior: ScreenBehavior,
    },
  ]
  public courtPlayer: CourtPlayer
  private player: Player
  private behaviorTree!: BehaviorTreeNode
  constructor(courtPlayer: CourtPlayer, player: Player) {
    this.courtPlayer = courtPlayer
    this.player = player
    this.setupBehaviorTree()
  }

  getTeammates() {
    return this.player.getCourtPlayers().filter((player) => {
      player != this.courtPlayer
    })
  }

  getOtherTeamPlayers() {
    return this.player.getOtherTeamCourtPlayers()
  }

  getSelectedPlayer() {
    return this.player.getSelectedCourtPlayer()
  }

  getHighlightedPlayer() {
    return this.player.getHighlightedPlayer()
  }

  setupBehaviorTree() {
    const blackboard = new Blackboard()
    this.behaviorTree = new SequenceNode('FriendlyPlayerAI', blackboard, [
      new PopulateBlackboard(blackboard, this),
      new SelectorNode(
        'RootSelector',
        blackboard,
        new SequenceNode('PlayerCommandSequence', blackboard, [
          new IsPlayerHighlighted(blackboard),
          new IsPlayerCommand(blackboard),
          new PlayerCommandSelector(blackboard),
        ]),
        new RandomBehaviorSelector(blackboard, [])
      ),
    ])
  }

  update() {
    if (this.player.getSelectedCourtPlayer() !== this.courtPlayer) {
      this.behaviorTree.tick()
    }
  }
}
