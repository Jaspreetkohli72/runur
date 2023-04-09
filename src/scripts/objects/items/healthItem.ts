import Player from "../player";
import Room from "../room";
import ItemBase from "./itemBase";
import Item from './item.interface';

export default class HealthItem extends ItemBase implements Item {
  sprite: Phaser.GameObjects.Sprite;
  plinthSprite: Phaser.GameObjects.Sprite;
  room: Room;
  startPosition: Phaser.Math.Vector2;
  colliders: any[] = [];
  owner: Player;

  constructor(room: Room, position: Phaser.Math.Vector2) {
    super(room, position);
    this.plinthSprite = this.room.scene.physics.add.sprite(this.startPosition.x, this.startPosition.y, 'boi', 6);
    this.sprite = this.room.scene.physics.add.sprite(this.startPosition.x, this.startPosition.y, 'item_health');
    this.sprite.play('item_health_idle');
    this.initColliders();
  }

  pickUp() {
    if(this.room.scene.player.health >= this.room.scene.player.maxHealth) return;
    this.owner = this.room.scene.player;
    this.sprite.setActive(false).setVisible(false);
    this.destroyColliders();
    this.owner.modifyHealth(1);
  }
}
