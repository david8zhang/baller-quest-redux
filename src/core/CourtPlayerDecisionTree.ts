import { CourtPlayer } from './CourtPlayer'
import { Blackboard } from './decision-tree/Blackboard'
import { HasPossession } from './decision-tree/decisions/HasPossession'
import { IsBallLoose } from './decision-tree/decisions/IsBallLoose'
import { ShouldBlockShot } from './decision-tree/decisions/ShouldBlockShot'
import { ShouldContestShot } from './decision-tree/decisions/ShouldContestShot'
import { ShouldFightOverScreen } from './decision-tree/decisions/ShouldFightOverScreen'
import { ShouldHelpOnDefense } from './decision-tree/decisions/ShouldHelpOnDefense'
import { LeafNode } from './decision-tree/LeafNode'
import { PopulateBlackboard } from './decision-tree/PopulateBlackboard'
import { SelectorNode } from './decision-tree/SelectorNode'
import { SequenceNode } from './decision-tree/SequenceNode'
import { States } from './states/States'
import { Team } from './Team'

export const createDecisionTree = (
  blackboard: Blackboard,
  courtPlayer: CourtPlayer,
  team: Team
) => {
  return new SequenceNode('RootSequence', blackboard, [
    new PopulateBlackboard(blackboard, courtPlayer, team),
    new SelectorNode(
      'LooseBallSelector',
      blackboard,
      new SequenceNode('ChaseReboundSelector', blackboard, [
        new IsBallLoose(blackboard),
        new LeafNode('ChaseRebound', blackboard, States.CHASE_REBOUND),
      ]),
      new SelectorNode(
        'BlockShotSelector',
        blackboard,
        new SequenceNode('BlockShotSequence', blackboard, [
          new ShouldBlockShot(blackboard),
          new LeafNode('BlockShot', blackboard, States.BLOCK_SHOT),
        ]),
        new SelectorNode(
          'ContestShotSelector',
          blackboard,
          new SequenceNode('ContestShotSequence', blackboard, [
            new ShouldContestShot(blackboard),
            new LeafNode('ContestShot', blackboard, States.CONTEST_SHOT),
          ]),
          new SelectorNode(
            'OffenseOrDefenseSelector',
            blackboard,
            new SequenceNode('OffenseSequence', blackboard, [
              new HasPossession(blackboard),
              new LeafNode('IdleState', blackboard, States.IDLE),
            ]),
            new SelectorNode(
              'ShouldReactToScreen',
              blackboard,
              new SelectorNode(
                'ShouldHelpOrFightOverScreen',
                blackboard,
                new SequenceNode('FightOverScreenSeq', blackboard, [
                  new ShouldFightOverScreen(blackboard),
                  new LeafNode('FightOverScreen', blackboard, States.FIGHT_OVER_SCREEN),
                ]),
                new SequenceNode('HelpDefenseSeq', blackboard, [
                  new ShouldHelpOnDefense(blackboard),
                  new LeafNode('HelpDefense', blackboard, States.HELP_DEFENSE),
                ])
              ),
              new LeafNode('DefendMan', blackboard, States.DEFEND_MAN)
            )
          )
        )
      )
    ),
  ])
}
