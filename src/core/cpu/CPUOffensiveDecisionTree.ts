import { CourtPlayer } from '../CourtPlayer'
import { Blackboard } from '../decision-tree/Blackboard'
import { SequenceNode } from '../decision-tree/SequenceNode'
import { Team } from '../Team'

export const createOffensiveDecisionTree = (
  blackboard: Blackboard,
  currPlayer: CourtPlayer,
  team: Team
) => {
  return new SequenceNode('OffenseRootSequence', blackboard, [])
}
