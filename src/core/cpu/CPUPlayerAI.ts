import Game from '~/scenes/Game'
import { CourtPlayer } from '../CourtPlayer'
import { HasPossession } from '../decision-tree/decisions/HasPossession'
import { IsBallLoose } from '../decision-tree/decisions/IsBallLoose'
import { LeafNode } from '../decision-tree/LeafNode'
import { SelectorNode } from '../decision-tree/SelectorNode'
import { SequenceNode } from '../decision-tree/SequenceNode'
import { TreeNode } from '../decision-tree/TreeNode'
import { ChaseRebound } from '../states/ChaseRebound'
import { DefendManState } from '../states/defense/DefendManState'
import { IdleState } from '../states/IdleState'
import { State, StateMachine } from '../states/StateMachine'
import { States } from '../states/States'
import { CPUTeam } from './CPUTeam'

export class CPUPlayerAI {
  private game: Game
  private cpuTeam: CPUTeam
  public courtPlayer: CourtPlayer
  public stateMachine: StateMachine
  public decisionTree!: TreeNode

  constructor(game: Game, courtPlayer: CourtPlayer, cpuTeam: CPUTeam) {
    this.game = game
    this.courtPlayer = courtPlayer
    this.cpuTeam = cpuTeam
    this.stateMachine = new StateMachine(
      States.IDLE,
      {
        [States.IDLE]: new IdleState(),
        [States.DEFEND_MAN]: new DefendManState(),
        [States.CHASE_REBOUND]: new ChaseRebound(),
      },
      [this.courtPlayer, this.cpuTeam]
    )
    this.setupDecisionTree()
  }

  setupDecisionTree() {
    this.decisionTree = new SelectorNode(
      'LooseBallSelector',
      this.cpuTeam,
      new SequenceNode('ChaseReboundSelector', this.cpuTeam, [
        new IsBallLoose(this.cpuTeam),
        new LeafNode('ChaseRebound', this.cpuTeam, States.CHASE_REBOUND),
      ]),
      new SelectorNode(
        'OffenseOrDefenseSelector',
        this.cpuTeam,
        new SequenceNode('OffenseSequence', this.cpuTeam, [
          new HasPossession(this.cpuTeam),
          new LeafNode('Idle', this.cpuTeam, States.IDLE),
        ]),
        new SequenceNode('DefenseSequence', this.cpuTeam, [
          new LeafNode('DefendMan', this.cpuTeam, States.DEFEND_MAN),
        ])
      )
    )
  }

  get ball() {
    return this.game.ball
  }

  getTeammates() {
    return this.cpuTeam.getCourtPlayers().filter((player) => {
      return player != this.courtPlayer
    })
  }

  getOtherTeamPlayers() {
    return this.cpuTeam.getOtherTeamCourtPlayers()
  }

  update() {
    const nextState = this.decisionTree.process() as States
    this.stateMachine.transition(nextState)
    this.stateMachine.step()
  }
}
