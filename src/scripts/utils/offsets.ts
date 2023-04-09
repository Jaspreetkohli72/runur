export default class OffsetUtils {
  static normalize(x: number, y: number, normal: number = 16): Phaser.Math.Vector2 {
    const max = Math.max(Math.abs(x), Math.abs(y));
    const coef = 16 / max;
    return new Phaser.Math.Vector2(x * coef, y * coef);
  }
  static randomPositionInRoom(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      8 + 32 + Math.floor(Math.random() * (16 * 12)), // 8 = center of sprite, 32 = 2 tiles from left, 16*12 = max 12 tiles from left
      8 + 32 + Math.floor(Math.random() * (16 * 6)) // 8 = center of sprite, 32 = 2 tiles from left, 16*6 = max 6 tiles from top
    )
  }
}