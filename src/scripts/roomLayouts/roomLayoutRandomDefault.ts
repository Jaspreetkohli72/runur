import OffsetUtils from "../utils/offsets";
import EnemyPosition from "./enemyPosition";
import RoomLayoutBase from "./roomLayoutBase";

export default class RoomLayoutRandomDefault extends RoomLayoutBase {
    public static enemyPositions: Array<any> = [];
    public static itemLayout = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    static getEnemyPositions() {
        let enemyCount = Phaser.Math.Between(1, 6);
        let possibleEnemies = ['EnemyKnight', 'SkelleeEnemy'];
        for (let i = 0; i < enemyCount; ++i) {
            RoomLayoutRandomDefault.enemyPositions.push(new EnemyPosition(
                RoomLayoutRandomDefault.randomEnemyPositon(),
                possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)],
                {
                    tint: Math.random() * 0xffffff,
                    health: 2,
                    dmg: 1,
                }
            ));
        }
        return RoomLayoutRandomDefault.enemyPositions;
    }

    static randomEnemyPositon(): Phaser.Math.Vector2 {
        return OffsetUtils.randomPositionInRoom();
    }
}