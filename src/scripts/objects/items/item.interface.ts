import Player from "../player";
import Room from "../room";

export default interface Item {
  sprite: Phaser.GameObjects.Sprite;
  plinthSprite: Phaser.GameObjects.Sprite;
  room: Room;
  itemRoom: Room;
  startPosition: Phaser.Math.Vector2;
  colliders: any[];
  owner: Player | null;

  initColliders();
  destroyColliders();
  pickUp();
  putDown();
}
