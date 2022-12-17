import Game from '~/scenes/Game'
import { BehaviorTreeNode } from '../behavior-tree/BehaviorTreeNode'
import { Blackboard } from '../behavior-tree/Blackboard'
import { SelectorNode } from '../behavior-tree/SelectorNode'
import { SequenceNode } from '../behavior-tree/SequenceNode'
import { CourtPlayer } from '../CourtPlayer'
import { IsBallLoose } from '../cpu/behaviors/defense/IsBallLoose'
import { ChaseRebound } from './behaviors/defense/ChaseRebound'
import { PlayerCommandSelector } from './behaviors/PlayerCommandSelector'
import { ScreenBehavior } from './behaviors/offense/ScreenBehavior'
import { PopulateBlackboard } from './behaviors/PopulateBlackboard'
import { Player } from './Player'
import { IsPlayerHighlighted } from './behaviors/IsPlayerHighlighted'
import { IsPlayerCommand } from './behaviors/IsPlayerCommand'
import { TeamHasPossession } from './behaviors/offense/TeamHasPossession'

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
        'PlayerCommandOrAIControl',
        blackboard,
        new SequenceNode('PlayerCommandSequence', blackboard, [
          new IsPlayerHighlighted(blackboard),
          new IsPlayerCommand(blackboard),
          new PlayerCommandSelector(blackboard),
        ]),
        new SelectorNode(
          'OffenseOrDefense',
          blackboard,
          new SequenceNode('OffenseSequence', blackboard, [new TeamHasPossession(blackboard)]),
          new SelectorNode(
            'DefenseSelector',
            blackboard,
            new SequenceNode('ReboundSequence', blackboard, [
              new IsBallLoose(blackboard),
              new ChaseRebound(blackboard),
            ]),
            new SequenceNode('DefendSequence', blackboard, [])
          )
        )
      ),
    ])
  }

  update() {
    if (
      this.player.getSelectedCourtPlayer() !== this.courtPlayer &&
      !Game.instance.isChangingPossession
    ) {
      this.behaviorTree.tick()
    }
  }
}
