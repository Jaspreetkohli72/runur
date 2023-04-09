import Item from "../items/item.interface";
import Room from "../room";

export default class RoomItemsRepository {
  room: Room;
  items: Array<Item> = [];

  constructor(room: Room) {
    this.room = room;
  }

  add(item: Item) {
    this.items.push(item);
  }

  remove(item: Item) {
    this.items = this.items.filter(i => i !== item);
  }

  onEnterRoom() {
    this.items.forEach((item) => {
      if (item.room === this.room) {
        item.plinthSprite.setActive(true).setVisible(true)
      }
      if (item.itemRoom === this.room && !item.owner) {
        item.sprite.setActive(true).setVisible(true)
        item.initColliders()
      }
    })
  }

  onLeaveRoom() {
    this.items.forEach((item) => {
      item.plinthSprite.setActive(false).setVisible(false)
      item.sprite.setActive(false).setVisible(false)
      item.destroyColliders()
    })
  }
}
