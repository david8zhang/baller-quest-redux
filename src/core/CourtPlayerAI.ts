import Game from '~/scenes/Game'
import { SORT_ORDER } from './Constants'
import { CourtPlayer } from './CourtPlayer'
import { HasPossession } from './decision-tree/decisions/HasPossession'
import { IsBallLoose } from './decision-tree/decisions/IsBallLoose'
import { LeafNode } from './decision-tree/LeafNode'
import { SelectorNode } from './decision-tree/SelectorNode'
import { SequenceNode } from './decision-tree/SequenceNode'
import { TreeNode } from './decision-tree/TreeNode'
import { ChaseReboundState } from './states/ChaseReboundState'
import { DefendManState } from './states/defense/DefendManState'
import { IdleState } from './states/IdleState'
import { SetScreenState } from './states/offense/SetScreenState'
import { StateMachine } from './states/StateMachine'
import { States } from './states/States'
import { Team } from './Team'

export abstract class CourtPlayerAI {
  protected team: Team
  public courtPlayer: CourtPlayer
  protected stateMachine: StateMachine
  protected decisionTree!: TreeNode
  protected stateText: Phaser.GameObjects.Text

  constructor(courtPlayer: CourtPlayer, team: Team) {
    this.courtPlayer = courtPlayer
    this.team = team
    this.stateMachine = new StateMachine(
      States.IDLE,
      {
        [States.IDLE]: new IdleState(),
        [States.DEFEND_MAN]: new DefendManState(),
        [States.CHASE_REBOUND]: new ChaseReboundState(),
        [States.SET_SCREEN]: new SetScreenState(),
      },
      [this, this.team]
    )
    this.stateText = Game.instance.add
      .text(this.courtPlayer.x, this.courtPlayer.y - 20, '', {
        fontSize: '12px',
        color: 'black',
      })
      .setDepth(SORT_ORDER.ui)
    this.setupDecisionTree()
  }

  setState(newState: States) {
    this.stateMachine.transition(newState)
  }

  setupDecisionTree() {
    this.decisionTree = new SelectorNode(
      'LooseBallSelector',
      this.team,
      new SequenceNode('ChaseReboundSelector', this.team, [
        new IsBallLoose(this.team),
        new LeafNode('ChaseRebound', this.team, States.CHASE_REBOUND),
      ]),
      new SelectorNode(
        'OffenseOrDefenseSelector',
        this.team,
        new SequenceNode('OffenseSequence', this.team, [
          new HasPossession(this.team),
          new LeafNode('Idle', this.team, States.IDLE),
        ]),
        new SequenceNode('DefenseSequence', this.team, [
          new LeafNode('DefendMan', this.team, States.DEFEND_MAN),
        ])
      )
    )
  }

  public update() {
    this.stateText.setText(this.stateMachine.getState())
    this.stateText.setPosition(
      this.courtPlayer.x - this.stateText.displayWidth / 2,
      this.courtPlayer.y - 20 - this.stateText.displayHeight / 2
    )
  }

  public getCurrState() {
    return {
      key: this.stateMachine.getState(),
      data: this.stateMachine.getFullState(),
    }
  }
}
