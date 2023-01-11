export class PlayerConstants {
  public static PLAYER_STATS = {
    player1: {
      offSpeed: 3,
      defSpeed: 3,
      shooting: 3,
      block: 3,
      contest: 3,
    },
    player2: {
      offSpeed: 4,
      defSpeed: 2,
      shooting: 4,
      block: 1,
      contest: 1,
    },
    player3: {
      offSpeed: 2,
      defSpeed: 4,
      shooting: 1,
      block: 3,
      contest: 4,
    },
  }

  public static DEFENSIVE_ASSIGNMENTS = {
    player1: 'cpu1',
    player2: 'cpu2',
    player3: 'cpu3',
  }

  public static NEW_POSSESSION_PLAYER_ID = 'player1'
  public static PRIMARY_SCREENER_ID = 'player2'
  public static SECONDARY_SCREENER_ID = 'player3'

  public static DEFENSE_POSITIONS_PLAYER = {
    player1: {
      row: 14,
      col: 13,
    },
    player2: {
      row: 13,
      col: 20,
    },
    player3: {
      row: 13,
      col: 6,
    },
  }

  public static OFFENSE_POSITIONS_PLAYER = {
    player1: {
      row: 17,
      col: 13,
    },
    player2: {
      row: 16,
      col: 20,
    },
    player3: {
      row: 16,
      col: 6,
    },
  }
}
