export class CourtPlayerAttributeMapper {
  public static getOffensiveMovementSpeedFromAttr(offSpeed: number) {
    if (offSpeed === 1) {
      return 180
    }
    if (offSpeed === 2) {
      return 190
    }
    if (offSpeed === 3) {
      return 200
    }
    if (offSpeed === 4) {
      return 210
    }
    return 220
  }

  public static getDefensiveMovementSpeedFromAttr(defSpeed: number) {
    if (defSpeed === 1) {
      return 180
    }
    if (defSpeed === 2) {
      return 190
    }
    if (defSpeed === 3) {
      return 200
    }
    if (defSpeed === 4) {
      return 210
    }
    return 220
  }
}
