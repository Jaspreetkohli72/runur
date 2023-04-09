import Config from "../config";
import LevelsConfig from "../config/levelsConfig";
import MainScene from "../scenes/mainScene";
import OffsetUtils from "../utils/offsets";
import State from "../utils/state";
import EnemyFactory from "./enemies/enemyFactory";
import DamageItem from "./items/damageItem";
import HealthItem from "./items/healthItem";
import MaxHealthItem from "./items/maxHealthItem";
import SpeedItem from "./items/speedItem";
import RoomItemsRepository from "./roomItems/roomItemsRepository";


class EnemyPosition {
    public position: Phaser.Math.Vector2;
    public enemyName: string; // enum pls
    public config: any;

    constructor(position: Phaser.Math.Vector2, enemyName: string, config?: any) {
        this.position = position;
        this.enemyName = enemyName;
        this.config = config;
    }
}

export default class Room {
    public visited: boolean = false;
    public enemyPositions: Array<EnemyPosition> = [];
    public enemies: Array<any> = []; //TODO: interface
    public scene: MainScene;
    public x: integer;
    public y: integer;
    public roomComplete: boolean = false;
    public itemsRepository: RoomItemsRepository;
    public isActive: boolean = false;

    constructor(scene: MainScene, x: integer, y: integer) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    enter() {
        this.isActive = true;

        // this.completeRoom();

        this.scene.doorsRepository.closeAll();

        // if room is not complete then create all the enemies & lock doors
        if (!this.roomComplete) {
            this.enemyPositions = LevelsConfig.levels[State.currentLevelId].rooms[this.x][this.y].layout.getEnemyPositions();
            this.scene.doorsRepository.lockAll();
            this.enemyPositions.forEach((enemyPosition: EnemyPosition) => {
                this.enemies.push(new EnemyFactory(
                    enemyPosition.enemyName,
                    this.scene,
                    enemyPosition.position.x,
                    enemyPosition.position.y,
                    enemyPosition.config
                ))
            });
        }

        if (!this.visited) this.initItems();
        this.initEnemies();

        this.itemsRepository.onEnterRoom();
        this.visited = true;
    }

    leave() {
        this.isActive = false;
        this.enemies.forEach((enemy) => {
            enemy.destroy();
        });
        this.itemsRepository.onLeaveRoom();
        this.enemies = [];
    }

    initItems() {
        this.itemsRepository = this.enemyPositions = LevelsConfig.levels[State.currentLevelId].rooms[this.x][this.y].layout.getRoomItemsRepository(this);
    }

    initEnemies() {
        this.enemies.forEach((enemy) => {
            enemy.create();
        });
    }

    update() {
        this.enemies = this.enemies.filter((enemy) => {
            return enemy.active;
        });
        if (!this.roomComplete && this.enemies.length === 0) {
            this.completeRoom();
        }
        for (const enemy of this.enemies) {
            enemy.update();
        }
    }

    completeRoom() {
        this.roomComplete = true;
        this.scene.doorsRepository.unlockAll();
    }

    randomEnemyPositon(): Phaser.Math.Vector2 {
        return OffsetUtils.randomPositionInRoom();
    }

}