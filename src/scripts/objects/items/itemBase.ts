import RoomState from "../../state/roomState";
import Player from "../player";
import Room from "../room";
import Item from "./item.interface";

export default class ItemBase implements Item {
  sprite: Phaser.GameObjects.Sprite;
  plinthSprite: Phaser.GameObjects.Sprite;
  room: Room; // origin room
  itemRoom: Room; // room the item is currently in
  startPosition: Phaser.Math.Vector2;
  colliders: any[] = [];
  owner: Player | null;

  constructor(room: Room, position: Phaser.Math.Vector2) {
    this.room = room;
    this.itemRoom = room;
    this.startPosition = position;
  }

  initColliders() {
    // player pick up
    this.colliders.push(
      this.room.scene.physics.add.overlap(this.sprite, this.room.scene.player, (enemy, player) => {
        this.pickUp();
        return true;
      })
    );
  }

  destroyColliders() {
    this.colliders.forEach((c) => {
      this.room.scene.physics.world.removeCollider(c);
      c.destroy();
    })
    this.colliders = [];
  }

  pickUp() {
    if(this.owner) return;
    this.owner = this.room.scene.player;
    this.room.scene.player.items.push(this);
    this.sprite.setActive(false).setVisible(false);
    this.destroyColliders();
  }

  putDown() {
    this.sprite.x = this.owner?.x || this.startPosition.x;
    this.sprite.y = this.owner?.y || this.startPosition.y;
    this.itemRoom = RoomState.activeRoom; // set item is in current room
    RoomState.activeRoom.itemsRepository.add(this); // add to current room repository
    this.owner?.items.filter((item) => item !== this); // remove item from player
    this.owner = null;
    this.sprite.setActive(true).setVisible(true);
    this.room.scene.time.delayedCall(1000, () => this.initColliders());
  }
}
