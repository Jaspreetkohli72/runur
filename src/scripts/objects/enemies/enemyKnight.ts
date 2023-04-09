import 'phaser';
import MainScene from '../../scenes/mainScene';

export default class EnemyKnight extends Phaser.GameObjects.Container {
    public knight: Phaser.Physics.Arcade.Sprite;
    public sword: Phaser.Physics.Arcade.Sprite;
    private readonly knightKey: string;
    private readonly swordKey: string;
    private flipLocked: boolean = false;
    private isAttacking: boolean = false;
    private canAttack: boolean = true;
    private currentMovement: Phaser.Math.Vector2;
    private isMoving: boolean = false;
    public config: any;
    private hurtCooldown: boolean;
    public health: integer = 2;
    public dead: boolean = false;
    public injuredCooldown: boolean = false;
    public colliders: Array<any> = [];
    private timerEvents: Array<Phaser.Time.TimerEvent> = [];
    public velocity: Phaser.Math.Vector2;
    public getHitSound: Phaser.Sound.BaseSound;

    constructor(scene, x, y, config) {
        super(scene, x, y);
        this.config = config;
        this.knightKey = 'assets/img/knight';
        this.swordKey = 'assets/img/sword';
        this.config = config;
        if(this.config?.health) this.health = this.config.health;
    }

    public preload() {
    }

    public getScene() {
        return this.scene as MainScene;
    }

    public create() {
        this.knight = this.scene.physics.add.sprite(0, 0, this.knightKey);
        this.knight.tint = this.config?.tint ?? Math.random() * 0xffffff;
        this.sword = this.scene.physics.add.sprite(-1, 6, this.swordKey);
        this.sword.tint = 0xff5555;
        this.add([this.knight, this.sword]);
        this.setSize(12, 9);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.getHitSound = this.scene.sound.add('sword_strike_2');

        this.knight.body.setSize(12, 12);
        this.sword.body.setSize(15, 30);
        this.sword.body.setOffset(30, 20);
        this.getBody().setOffset(0, 8);
        this.getBody().collideWorldBounds = true;
        this.setDepth(0);
        this.getScene().doorsRepository.enemyCollide(this);
        this.scene.anims.create({
            key: 'sword_idle',
            frames: this.scene.anims.generateFrameNumbers(this.swordKey, { start: 0, end: 1 }),
            repeat: -1,
            frameRate: 8
        });
        this.scene.anims.create({
            key: 'sword_attack',
            frames: this.scene.anims.generateFrameNumbers(this.swordKey, { start: 2, end: 6 }),
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
        this.knight?.play('knight_idle');
        this.sword?.play('sword_idle');
        this.scene.physics.add.collider(this, this.getScene().wallsLayer);

        this.getBody().pushable = false;

        this.colliders = [
            // collide with player
            // this.scene.physics.add.collider(this, this.getScene().player),
            // hurt the player
            this.scene.physics.add.overlap(this.sword, this.getScene().player, (enemy, player) => {
                if (this.isAttacking) this.hurtPlayer();
            }),
            // player hurt this enemy
            this.scene.physics.add.overlap(this, this.getScene().player.sword, (enemy, player) => {
                if (this.getScene().player.isAttacking) {
                    this.modifyHealth(-this.getScene().player.stat.dmg);
                }
            })
        ];
    }

    public update() {
        if (this.dead) return;
        if (!this.isMoving) {
            let speeds = [0, 32, 32, 32, 64, 64];
            this.velocity = new Phaser.Math.Vector2(speeds[Phaser.Math.Between(0, speeds.length - 1)], 0)

            this.currentMovement = Phaser.Utils.Objects.Clone(this.velocity) as Phaser.Math.Vector2;
            let angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, this.getScene().player.x, this.getScene().player.y);
            this.currentMovement.rotate(angleToPlayer);

            this.isMoving = true;
            this.timerEvents.push(this.scene.time.delayedCall(1500, () => this.isMoving = false));
        }

        this.getBody().setVelocity(this.currentMovement.x, this.currentMovement.y);
        if (this.currentMovement.x === 0 && this.currentMovement.y === 0) {
            this.knight?.play('knight_idle', true);
        } else {
            const animation = 'knight_run';
            this.knight?.play(animation, true);
        }
        this.flipX(this.currentMovement.x);
        // 10% chance to attack
        const randomAttack = Math.floor(Math.random() * 10);
        if (randomAttack === 5) {
            this.attack();
        }
        if (this.sword.flipX) {
            this.sword.body.setOffset(5, 20);
        } else {
            this.sword.body.setOffset(30, 20);
        }
        this.showInjured();
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

    private flipX(xVelocity: number) {
        if (this.flipLocked) return;
        if (xVelocity !== 0) {
            this.knight.flipX = (xVelocity < 0);
            this.sword.flipX = (xVelocity < 0);
            this.sword.x = (xVelocity < 0) ? 1 : -1;
        }
    }

    private attack() {
        if (this.dead || !this.canAttack) return;
        let attack = ((player) => {
            const xOffset = player.x - this.x;
            const yOffset = player.y - this.y;
            const decisiveOffset = (Math.abs(xOffset) >= Math.abs(yOffset)) ? 'x' : 'y';
            if (decisiveOffset === 'x') return (xOffset < 0) ? 'right' : 'left';
            return (yOffset < 0) ? 'down' : 'up';
        })(this.getScene().player);
        if (attack === 'up') {
            this.sword.angle = (this.sword.flipX) ? 90 : -90;
        }
        if (attack === 'down') {
            this.sword.angle = (this.sword.flipX) ? -90 : 90;
        }
        this.sword?.play('sword_attack', true);
        this.isAttacking = true;
        this.canAttack = false;
        this.timerEvents.push(this.scene.time.delayedCall(312, () => {
            this.sword?.play('sword_idle');
            this.isAttacking = false;
            this.sword.angle = 0;
        }));
        this.timerEvents.push(this.scene.time.delayedCall(1000, () => this.canAttack = true));
    }

    private hurtPlayer() {
        if (this.hurtCooldown) return;
        this.getScene().player.modifyHealth(-(this.config?.dmg ?? 1));
        this.hurtCooldown = true;
        this.timerEvents.push(this.scene.time.delayedCall(1000, () => this.hurtCooldown = false));
    }


    public modifyHealth(amount: integer) {
        if (this.health) {
            this.health += amount;
            if (this.health <= 0) return this.die();
        }
        if (amount <= 0) {
            this.injuredCooldown = true;
            this.getHitSound.play();
            this.timerEvents.push(this.scene.time.delayedCall(500, () => this.injuredCooldown = false));
        }
    }

    public die() {
        //TODO: death animation, do setActive(false) when anim complete
        this.dead = true;
        this.colliders.forEach((c) => {
            this.getScene().physics.world.removeCollider(c);
        })
        this.setActive(false).setVisible(false);
        for (const timer of this.timerEvents) {
            if (timer) {
                timer.destroy();
            }
        }
        this.scene.time.delayedCall(300, this.destroy);
    }

    private getBody() {
        return this.body as Phaser.Physics.Arcade.Body
    }
}