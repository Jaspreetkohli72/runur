import Player from "../player";
import Room from "../room";
import ItemBase from "./itemBase";

export default class MaxHealthItem extends ItemBase {
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
    this.sprite = this.room.scene.physics.add.sprite(this.startPosition.x, this.startPosition.y, 'item_1');
    this.sprite.play('item_1_idle');
    this.initColliders();
  }

  pickUp() {
    super.pickUp();
    this.owner.maxHealth += 1;
    this.owner.modifyHealth(0);
  }

  putDown() {
    this.owner.maxHealth -= 1;
    if (this.owner.health > this.owner.maxHealth) {
      this.owner.modifyHealth(this.owner.maxHealth - this.owner.health);
    } else {
      this.owner.modifyHealth(0);
    }
    super.putDown();
  }
}
