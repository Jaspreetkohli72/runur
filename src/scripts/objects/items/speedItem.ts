import Player from "../player";
import Room from "../room";
import ItemBase from "./itemBase";

export default class SpeedItem extends ItemBase {
  sprite: Phaser.GameObjects.Sprite;
  plinthSprite: Phaser.GameObjects.Sprite;
  room: Room;
  startPosition: Phaser.Math.Vector2;
  colliders: any[] = [];
  owner: Player;

  constructor(room: Room, position: Phaser.Math.Vector2) {
    super(room, position);
    this.plinthSprite = this.room.scene.physics.add.sprite(this.startPosition.x, this.startPosition.y, 'boi', 112);
    this.plinthSprite.setDisplayOrigin(8, -7)
    this.sprite = this.room.scene.physics.add.sprite(this.startPosition.x, this.startPosition.y, 'item_2');
    this.sprite.play('item_2_idle');
    this.initColliders();
  }

  pickUp() {
    super.pickUp();
    this.owner.stat.speedMultiplier += 0.2
  }

  putDown() {
    this.owner.stat.speedMultiplier -= 0.2
    super.putDown();
  }
}
