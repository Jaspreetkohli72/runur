import 'phaser';
import MainScene from '../scenes/mainScene';
import Item from './items/item.interface';

type KeyMap = { [key: string]: Phaser.Input.Keyboard.Key };
export default class Player extends Phaser.GameObjects.Container {
    private keys: KeyMap;
    public knight: Phaser.Physics.Arcade.Sprite;
    public sword: Phaser.Physics.Arcade.Sprite;
    private readonly knightKey: string;
    private readonly swordKey: string;
    public attackHurtCooldown: number = 300; // duration attack will deal damage from keypress
    private flipLocked: boolean = false;
    public isAttacking: boolean = false;
    public canAttack: boolean = true;
    private attackCooldown: number = 1000;
    public maxHealth: integer = 3;
    public health: integer = 3;
    public canMove: boolean = true;
    public dead: boolean = false;
    public injuredCooldown: boolean = false;
    public stat: any;
    public walkSounds: Array<Phaser.Sound.BaseSound> = [];
    public runSounds: Array<Phaser.Sound.BaseSound> = [];
    public swingSound: Phaser.Sound.BaseSound;
    public items: Item[] = [];

    constructor(scene, x, y) {
        super(scene, x, y);
        this.knightKey = 'assets/img/knight';
        this.swordKey = 'assets/img/sword';
        this.stat = {
            dmg: 1,
            speedMultiplier: 0.8
        };
    }

    public preload() {
        this.scene.load.spritesheet(this.knightKey, this.knightKey + '.png', {
            frameWidth: 25,
            frameHeight: 27
        });
        this.scene.load.spritesheet(this.swordKey, this.swordKey + '.png', {
            frameWidth: 49,
            frameHeight: 65
        });
    }

    public create() {
        this.knight = this.scene.physics.add.sprite(0, 0, this.knightKey);
        this.sword = this.scene.physics.add.sprite(-1, 6, this.swordKey);
        this.add([this.knight, this.sword]);
        this.setSize(12, 9);
        this.scene.add.existing(this);
        this.walkSounds.push(
            this.scene.sound.add('knight_walk_0'),
            this.scene.sound.add('knight_walk_1'),
            this.scene.sound.add('knight_walk_2'),
            this.scene.sound.add('knight_walk_3'),
            this.scene.sound.add('knight_walk_4'),
        );
        this.runSounds.push(
            this.scene.sound.add('knight_run_0'),
            this.scene.sound.add('knight_run_1'),
            this.scene.sound.add('knight_run_2'),
            this.scene.sound.add('knight_run_3'),
            this.scene.sound.add('knight_run_4'),
        )
        this.swingSound = this.scene.sound.add('sword_swing_1');
        this.scene.physics.add.existing(this);

        this.knight.body.setSize(12, 12);
        this.sword.body.setSize(15, 30);
        this.sword.body.setOffset(30, 20);
        this.getBody().setOffset(0, 8);
        this.getBody().collideWorldBounds = true;
        this.setDepth(1);
        this.scene.anims.create({
            key: 'sword_idle',
            frames: this.scene.anims.generateFrameNumbers(this.swordKey, { start: 0, end: 1 }),
            repeat: -1,
            frameRate: 8
        });
        const frames = this.scene.anims.generateFrameNumbers(this.swordKey, { start: 2, end: 6 });
        this.scene.anims.create({
            key: 'sword_attack',
            frames,
            repeat: 0,
            frameRate: 16
        });
        this.scene.anims.create({
            key: 'knight_idle',
            frames: this.scene.anims.generateFrameNumbers(this.knightKey, {
                start: 0,
                end: 3
            }),
            repeat: -1,
            frameRate: 12
        });
        this.scene.anims.create({
            key: 'knight_run',
            frames: this.scene.anims.generateFrameNumbers(this.knightKey, { start: 4, end: 7 }),
            repeat: -1,
            frameRate: 12
        });
        this.scene.anims.create({
            key: 'knight_walk',
            frames: this.scene.anims.generateFrameNumbers(this.knightKey, { start: 8, end: 15 }),
            repeat: -1,
            frameRate: 12
        });
        this.knight.play('knight_idle');
        this.sword.play('sword_idle');
        this.keys = this.scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT') as KeyMap;

        //drop an item 
        this.scene.input.keyboard.on('keyup-' + 'SPACE', () => {
            if (this.items && this.items.length > 0) {
                let droppedItem = this.items.shift() as Item;
                droppedItem.putDown();
            }
        });
    }

    public update() {
        const velocity = new Phaser.Math.Vector2(0, 0);
        let attack: string | null = null;
        if (!this.canMove) return;
        if (this.keys.W.isDown) {
            velocity.y -= 64;
        }
        if (this.keys.A.isDown) {
            velocity.x -= 64;
        }
        if (this.keys.S.isDown) {
            velocity.y += 64;
        }
        if (this.keys.D.isDown) {
            velocity.x += 64;
        }
        if (velocity.x !== 0 && velocity.y !== 0) {
            velocity.x /= 1.5;
            velocity.y /= 1.5;
        }
        if (this.keys.SHIFT.isDown) {
            velocity.x *= 2;
            velocity.y *= 2;
        }
        if (this.canAttack) {
            if (this.keys.UP.isDown) {
                attack = "up";
            } else if (this.keys.LEFT.isDown) {
                attack = "left";
            } else if (this.keys.DOWN.isDown) {
                attack = "down";
            } else if (this.keys.RIGHT.isDown) {
                attack = "right";
            }
        }
        this.getBody().setVelocity(velocity.x * this.stat.speedMultiplier, velocity.y * this.stat.speedMultiplier);
        if (velocity.x === 0 && velocity.y === 0) {
            this.knight.play('knight_idle', true);
        } else {
            const animation = (this.keys.SHIFT.isDown) ? 'knight_run' : 'knight_walk';
            const sounds = (this.keys.SHIFT.isDown) ? this.runSounds : this.walkSounds;
            if (sounds.find(s => s.isPlaying) == null) {
                const index = Math.floor(Math.random() * 5);
                sounds[index].play();
            }
            this.knight.play(animation, true);
        }
        this.flipX(velocity.x, attack);
        this.attack(attack);
        if (this.sword.flipX) {
            this.sword.body.setOffset(5, 20);
        } else {
            this.sword.body.setOffset(30, 20);
        }
        this.showInjured()
    }

    showInjured() {
        if (this.injuredCooldown) {
            let osc = Math.abs(Math.sin(this.scene.time.now / 100));
            this.knight.tint = Phaser.Display.Color.GetColor(155 + 100 * osc, 0, 0);
            this.knight.alpha = 0.6 + 0.3 * osc;
        } else {
            this.knight.clearTint();
            this.knight.alpha = 1;
        }
    }

    private flipX(xVelocity: number, attack: string | null) {
        if (this.flipLocked) return;
        if (attack !== 'right' && attack !== 'left' && xVelocity !== 0) {
            this.knight.flipX = (xVelocity < 0);
            this.sword.flipX = (xVelocity < 0);
            this.sword.x = (xVelocity < 0) ? 1 : -1;
        } else if (attack === 'right') {
            this.knight.flipX = false;
            this.sword.flipX = false;
            this.sword.x = -1;
            this.flipLocked = true;
            this.scene.time.delayedCall(313, () => this.flipLocked = false);
        } else if (attack === 'left') {
            this.knight.flipX = true;
            this.sword.flipX = true;
            this.sword.x = 1;
            this.flipLocked = true;
            this.scene.time.delayedCall(313, () => this.flipLocked = false);
        }
    }

    private attack(attack: string | null) {
        if (!this.canAttack || attack === null) return;
        if (attack === 'up') {
            this.sword.angle = (this.sword.flipX) ? 90 : -90;
        }
        if (attack === 'down') {
            this.sword.angle = (this.sword.flipX) ? -90 : 90;
        }
        this.sword.play('sword_attack', true);
        // const swingIndex = Math.floor(Math.random() * 3) + 1;
        // this.scene.sound.play('sword_swing_' + swingIndex);
        this.swingSound.play();
        this.canAttack = false;

        // delay until attack hurts enemies
        this.scene.time.delayedCall(100, () => this.isAttacking = true);
        // delay until attack stops hurting enemies
        this.scene.time.delayedCall(this.attackHurtCooldown, () => {
            this.isAttacking = false;
            this.sword.play('sword_idle');
            this.sword.angle = 0;
        });
        this.scene.time.delayedCall(this.attackCooldown, () => this.canAttack = true);
    }

    public modifyHealth(amount: integer) {
        let oldHealth = this.health;
        if (this.health) {
            this.health = Math.min(this.health + amount, this.maxHealth);
            if (this.health <= 0) return this.die();
        }
        //if got injured
        if (oldHealth > this.health) {
            this.injuredCooldown = true;
            this.scene.time.delayedCall(500, () => this.injuredCooldown = false);
        }
        this.getScene().refreshHealthBar();
    }

    public die() {
        this.dead = true;
        this.getScene().gameOver();
    }

    private getScene() {
        return this.scene as MainScene;
    }

    private getBody() {
        return this.body as Phaser.Physics.Arcade.Body
    }
}