import { DoorsRepository } from "../objects/door";
import Player from "../objects/player";
import Room from "../objects/room";

export default interface RunurScene extends Phaser.Scene {

  player: Player;
  map: Phaser.Tilemaps.Tilemap;
  tilemapKey: string;
  tilesetKey: string;
  doorsRepository: DoorsRepository;
  wallsLayer: Phaser.Tilemaps.TilemapLayer;
  healthBarSprites: Array<any>;
  
  gameOver(): void;
  gotoRoom(x: integer, y: integer): void;
  refreshHealthBar(): void;

}
