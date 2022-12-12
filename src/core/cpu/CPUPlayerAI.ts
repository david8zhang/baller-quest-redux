import Game from '~/scenes/Game'
import { CourtPlayer } from '../CourtPlayer'
import { BehaviorTreeNode } from './behavior-tree/BehaviorTreeNode'
import { Blackboard } from './behavior-tree/Blackboard'
import { SelectorNode } from './behavior-tree/SelectorNode'
import { SequenceNode } from './behavior-tree/SequenceNode'
import { ContestPlayerShot } from './behaviors/defense/ContestPlayerShot'
import { GetManToDefend } from './behaviors/defense/GetManToDefend'
import { StayInFrontOfMan } from './behaviors/defense/StayInFrontOfMan'
import { PopulateBlackboard } from './behaviors/PopulateBlackboard'
import { CPU } from './CPU'

export class CPUPlayerAI {
  private game: Game
  private cpu: CPU
  public courtPlayer: CourtPlayer

  public blackboard!: Blackboard
  public behaviorTree!: BehaviorTreeNode

  constructor(game: Game, courtPlayer: CourtPlayer, cpu: CPU) {
    this.game = game
    this.courtPlayer = courtPlayer
    this.cpu = cpu
    this.setupBehaviorTree()
  }

  getTeammates() {
    return this.cpu.getCourtPlayers().filter((player) => {
      player != this.courtPlayer
    })
  }

  getOtherTeamPlayers() {
    return this.cpu.getOtherTeamCourtPlayers()
  }

  setupBehaviorTree() {
    this.blackboard = new Blackboard()
    this.behaviorTree = new SequenceNode('DefenseSequence', this.blackboard, [
      new PopulateBlackboard(this.blackboard, this),
      new GetManToDefend(this.blackboard),
      new SelectorNode(
        'StayWithDefenderOrContest',
        this.blackboard,
        new ContestPlayerShot(this.blackboard),
        new StayInFrontOfMan(this.blackboard)
      ),
    ])
  }

  process() {
    this.behaviorTree.tick()
  }
}
