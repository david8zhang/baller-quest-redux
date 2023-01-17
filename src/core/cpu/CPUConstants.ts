export class CPUConstants {
  public static PLAYER_STATS = {
    cpu1: {
      offSpeed: 3,
      defSpeed: 3,
      shooting: 3,
      block: 3,
      layup: 3,
      dunk: 3,
    },
    cpu2: {
      offSpeed: 4,
      defSpeed: 2,
      shooting: 4,
      block: 1,
      layup: 4,
      dunk: 1,
    },
    cpu3: {
      offSpeed: 2,
      defSpeed: 4,
      shooting: 1,
      block: 3,
      layup: 5,
      dunk: 5,
    },
  }

  public static DEFENSIVE_ASSIGNMENTS = {
    cpu1: 'player1',
    cpu2: 'player2',
    cpu3: 'player3',
  }

  public static NEW_POSSESSION_PLAYER_ID = 'cpu1'

  public static OFFENSE_POSITIONS_CPU = {
    cpu1: {
      row: 17,
      col: 13,
    },
    cpu2: {
      row: 16,
      col: 20,
    },
    cpu3: {
      row: 16,
      col: 6,
    },
  }

  public static DEFENSE_POSITIONS_CPU = {
    cpu1: {
      row: 14,
      col: 13,
    },
    cpu2: {
      row: 13,
      col: 20,
    },
    cpu3: {
      row: 13,
      col: 6,
    },
  }
}
