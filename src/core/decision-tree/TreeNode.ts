import { States } from '../states/States'
import { Team } from '../Team'
import { Decision } from './Decision'

export abstract class TreeNode {
  public name: string
  public team: Team

  constructor(name: string, team: Team) {
    this.name = name
    this.team = team
  }

  public abstract process(): Decision | States
}
