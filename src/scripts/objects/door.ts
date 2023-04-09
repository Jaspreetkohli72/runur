import MainScene from '../scenes/mainScene';
import RoomState from '../state/roomState';
import { DoorState, Orientation } from '../utils/enums';

interface DoorsList {
    [key: string]: Door;
}

export interface DoorsRepository {
    doorsRepository: DoorsList;
    preload(): void;
    create(): void;
}

export class DoorsRepository implements DoorsRepository {
    doors: DoorsList = {};

    add(key: string, door: Door): void {
        this.doors[key] = door;
    }
    preload(): void {
        this.call('preload');
    }
    create(): void {
        this.call('create');
    }
    closeAll(): void {
        this.call('close');
    }
    openAll(): void {
        this.call('open');
    }
    lockAll(): void {
        this.call('lock');
    }
    unlockAll(): void {
        this.call('unlock');
    }
    enemyCollide(enemy: Phaser.GameObjects.GameObject) {
        this.call('enemyCollide', enemy);
    }
    call(func: string, arg?: any): void {
        Object.values(this.doors).forEach(d => d[func](arg));
    }
}

export class Door {
    private orientation: Orientation;
    public static SpriteKey = 'assets/img/door';
    private sprite: Phaser.GameObjects.Sprite;
    private scene: MainScene;
    public x: number;
    public y: number;
    public state: DoorState = DoorState.Open;
    public locked: boolean;
    private collider: Phaser.Physics.Arcade.Collider | null;
    private touchingPlayer: boolean = false;

    constructor(scene: MainScene, x: number, y: number, orientation: Orientation) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.orientation = orientation;
    }

    public getScene() {
        return this.scene as MainScene;
    }

    public preload() {
        if (!this.scene.textures.exists(Door.SpriteKey)) {
            this.scene.load.spritesheet(Door.SpriteKey, Door.SpriteKey + '.png', {
                frameWidth: 32,
                frameHeight: 32
            });
        }
    }

    public enemyCollide(enemy: Phaser.Physics.Arcade.Sprite) {
        this.scene.physics.add.collider(this.sprite, enemy);
    }

    public create() {
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, Door.SpriteKey).setImmovable();
        this.sprite.angle = ((orientation: Orientation) => {
            switch (orientation) {
                case Orientation.East:
                    return -90;
                case Orientation.North:
                    return 180;
                case Orientation.West:
                    return 90;
                case Orientation.South:
                    return 0;
            }
        })(this.orientation);
        this.scene.add.existing(this.sprite);
        this.scene.anims.create({
            key: 'door_opening',
            frames: this.scene.anims.generateFrameNumbers(Door.SpriteKey, {
                frames: [3, 2, 1, 0]
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: 'door_closing',
            frames: this.scene.anims.generateFrameNumbers(Door.SpriteKey, {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 8
        });
        this.close();
    }

    public open() {
        if (this.locked || this.state === DoorState.Open) return;
        this.state = DoorState.Open;
        this.sprite.play('door_opening');
        this.collider?.destroy();
        this.collider = null;
    }

    public close() {
        if (this.state === DoorState.Closed) return;
        this.state = DoorState.Closed;
        this.sprite.play('door_closing');
        this.collider = this.scene.physics.add.collider(this.sprite, this.scene.player, (_, player) => {
            if (!this.locked && this.sprite.visible) this.touchingPlayer = true;
        });
    }

    public lock() {
        this.close();
        this.locked = true;
    }

    public unlock() {
        this.locked = false;
    }

    public update() {
        if (!this.touchingPlayer || this.locked) return;
        this.open();
        switch (this.orientation) {
            case Orientation.North:
                this.scene.gotoRoom(RoomState.activeRoom.x,RoomState.activeRoom.y + 1);
                break;
            case Orientation.East:
                this.scene.gotoRoom(RoomState.activeRoom.x - 1, RoomState.activeRoom.y);
                break;
            case Orientation.West:
                this.scene.gotoRoom(RoomState.activeRoom.x + 1, RoomState.activeRoom.y);
                break;
            case Orientation.South:
                this.scene.gotoRoom(RoomState.activeRoom.x, RoomState.activeRoom.y - 1);
                break;
        }
        this.touchingPlayer = false;
    }

    public enable() {
        this.sprite.setVisible(true)
    }

    public disable() {
        this.open();
        this.sprite.setVisible(false)
    }
}