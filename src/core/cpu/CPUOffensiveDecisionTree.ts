import { CourtPlayer } from '../CourtPlayer'
import { Blackboard } from '../decision-tree/Blackboard'
import { LeafNode } from '../decision-tree/LeafNode'
import { PopulateBlackboard } from '../decision-tree/PopulateBlackboard'
import { SelectorNode } from '../decision-tree/SelectorNode'
import { SequenceNode } from '../decision-tree/SequenceNode'
import { Team } from '../Team'
import { RandomSelector } from './decisions/RandomSelector'
import { PlayTypes } from './plays/PlayTypes'

export const createOffensiveDecisionTree = (
  blackboard: Blackboard,
  currPlayer: CourtPlayer,
  team: Team
) => {
  return new SequenceNode('OffenseRootSequence', blackboard, [
    new PopulateBlackboard(blackboard, currPlayer, team),
    new SelectorNode(
      'ShouldTakeShot',
      blackboard,
      new LeafNode('TakeShot', blackboard, PlayTypes.TAKE_SHOT),
      new RandomSelector(blackboard)
    ),
  ])
}
