export class CourtPlayerAttributeMapper {
  public static getOffensiveMovementSpeedFromAttr(offSpeed: number) {
    if (offSpeed === 1) {
      return 120
    }
    if (offSpeed === 2) {
      return 130
    }
    if (offSpeed === 3) {
      return 140
    }
    if (offSpeed === 4) {
      return 150
    }
    return 160
  }

  public static getDefensiveMovementSpeedFromAttr(defSpeed: number) {
    if (defSpeed === 1) {
      return 200
    }
    if (defSpeed === 2) {
      return 210
    }
    if (defSpeed === 3) {
      return 220
    }
    if (defSpeed === 4) {
      return 230
    }
    return 240
  }
}
