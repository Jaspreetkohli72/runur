import Room from "../objects/room";

export default class RoomState {
  public static rooms: Array<Room> = [];
  public static activeRoom: Room;

  public static getRoom(x: integer, y: integer): Room | void {
    return this.rooms.find((room) => {
      if (room.x === x && room.y === y) return room;
    });
  }

  public static gotoRoom(room: Room) {
    RoomState.activeRoom = room;
    RoomState.activeRoom.enter();
  }
}