import LevelsConfig from "../config/levelsConfig";
import DamageItem from "../objects/items/damageItem";
import HealthItem from "../objects/items/healthItem";
import MaxHealthItem from "../objects/items/maxHealthItem";
import SpeedItem from "../objects/items/speedItem";
import RoomItemsRepository from "../objects/roomItems/roomItemsRepository";
import OffsetUtils from "../utils/offsets";
import EnemyPosition from "./enemyPosition";

export default class RoomLayoutBase {
    public static enemyPositions: Array<any> = [];
    public static enemyLayout = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    public static itemLayout = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    public static enemyConfig = {
        // tint: 0xff0000,
        // health: 2,
        // dmg: 1
    }

    static getEnemyPositions() {
        for (let y = 0; y < this.enemyLayout.length; ++y) {
            for (let x = 0; x < this.enemyLayout[y].length; ++x) {
                if (!this.enemyLayout[y][x]) continue;
                this.enemyPositions.push(new EnemyPosition(
                    new Phaser.Math.Vector2(32 + x * 16, 32 + y * 16),
                    LevelsConfig.possibleEnemies[this.enemyLayout[y][x] - 1],
                    this.enemyConfig
                ));
            }
        }
        return this.enemyPositions;
    }

    static getRoomItemsRepository(room) {
        let itemsRepository = new RoomItemsRepository(room);
        for (let y = 0; y < this.itemLayout.length; ++y) {
            for (let x = 0; x < this.itemLayout[y].length; ++x) {
                if (!this.itemLayout[y][x]) continue;
                let pos = new Phaser.Math.Vector2(32 + x * 16, 32 + y * 16);
                let type = this.itemLayout[y][x];
                if (type === 9) type = Phaser.Math.Between(1, 4);
                switch (type) {
                    case 1:
                        itemsRepository.add(new HealthItem(room, pos));
                        break;
                    case 2:
                        itemsRepository.add(new MaxHealthItem(room, pos));
                        break;
                    case 3:
                        itemsRepository.add(new DamageItem(room, pos));
                        break;
                    case 4:
                        itemsRepository.add(new SpeedItem(room, pos));
                        break;
                }
            }
        }
        return itemsRepository;
    }
}