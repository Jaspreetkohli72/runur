import 'phaser';
import MainScene from '../../scenes/mainScene';
import Player from '../player';
import OffsetUtils from '../../utils/offsets';

export default class SkelleeEnemy extends Phaser.Physics.Arcade.Sprite {
    private readonly skelleeKey: string = 'assets/img/skellee';
    private flipLocked: boolean = false;
    private isAttacking: boolean = false;
    private currentMovement: Phaser.Math.Vector2;
    private isMoving: boolean = false;
    public config: any;
    private hurtCooldown: boolean;
    public health: integer = 2;
    private isBeingHit: boolean = false;
    public dead: boolean = false;
    public canAttack: boolean = true;
    public injuredCooldown: boolean = false;
    public colliders: Array<any> = [];
    private timerEvents: Array<Phaser.Time.TimerEvent> = [];
    public injuredSound: Phaser.Sound.BaseSound;

    constructor(scene, x, y, config) {
        super(scene, x, y, 'assets/img/skellee');
        this.skelleeKey = 'assets/img/skellee';
        this.config = config;
        if(this.config?.health) this.health = this.config.health;
    }

    public getScene() {
        return this.scene as MainScene;
    }

    public create() {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.injuredSound = this.scene.sound.add('sword_strike_1');

        this.body.setSize(12, 12);
        this.body.setOffset(0, 8);
        this.setSize(12, 9);
        this.getBody().collideWorldBounds = true;
        this.setDepth(0);
        this.getScene().doorsRepository.enemyCollide(this);
        this.scene.anims.create({
            key: 'skellee_idle',
            frames: this.scene.anims.generateFrameNumbers(this.skelleeKey, { start: 8, end: 11 }),
            repeat: -1,
            frameRate: 8
        });
        this.scene.anims.create({
            key: 'skellee_walk',
            frames: this.scene.anims.generateFrameNumbers(this.skelleeKey, { start: 16, end: 21 }),
            repeat: -1,
            frameRate: 8
        });
        this.scene.anims.create({
            key: 'skellee_throw',
            frames: this.scene.anims.generateFrameNumbers(this.skelleeKey, { start: 0, end: 7 }),
            repeat: 0,
            frameRate: 8
        });
        this.scene.physics.add.collider(this, this.getScene().wallsLayer);

        this.getBody().pushable = false;

        this.colliders = [
            this.scene.physics.add.overlap(this, this.getScene().player, () => {
                if (this.isAttacking) this.hurtPlayer();
            }),

            this.scene.physics.add.overlap(this, this.getScene().player.sword, () => {
                if (this.getScene().player.isAttacking) {
                    this.getHit(this.getScene().player);
                }
            })
        ];
        this.play('skellee_idle');
    }

    public getHit(attacker: Player) {
        if (this.isBeingHit) return;
        this.injuredSound.play();
        this.isBeingHit = true;
        this.timerEvents.push(this.scene.time.delayedCall(400, () => this.isBeingHit = false));
        const pushBack = OffsetUtils.normalize(this.x - attacker.x, this.y - attacker.y, 64)
        this.modifyHealth(0);
        this.timerEvents.push(this.scene.time.delayedCall(400, () => {
            this.isBeingHit = false;
            this.getBody().setVelocity(0, 0);
            this.modifyHealth(-attacker.stat.dmg);
        }));
        this.getBody().setVelocity(pushBack.x, pushBack.y);
    }
    public update() {
        if (!this.isMoving) {
            let randomX = Math.floor(Math.random() * 3) - 1;
            let randomY = Math.floor(Math.random() * 3) - 1;
            this.currentMovement = new Phaser.Math.Vector2(randomX * 32, randomY * 32);
            this.isMoving = true;
            this.timerEvents.push(this.scene.time.delayedCall(1500, () => this.isMoving = false));
        }
        this.getBody().setVelocity(this.currentMovement.x, this.currentMovement.y);
        if (!this.isAttacking) {
            if (this.currentMovement.x === 0 && this.currentMovement.y === 0) {
                this.play('skellee_idle', true);
            } else {
                this.play('skellee_walk', true);
            }
        }
        this.handleFlipX(this.currentMovement.x);
        // 10% chance to attack
        const randomAttack = Math.floor(Math.random() * 10);
        if (randomAttack == 10) {
            this.attack();
        }
        this.showInjured();
    }

    private handleFlipX(xVelocity: number) {
        if (this.flipLocked || xVelocity === 0) return;
        this.flipX = (xVelocity > 0);
    }

    private attack() {
        if (!this.canAttack) return;
        let attack = ((player) => {
            const xOffset = player.x - this.x;
            const yOffset = player.y - this.y;
            const decisiveOffset = (Math.abs(xOffset) >= Math.abs(yOffset)) ? 'x' : 'y';
            if (decisiveOffset === 'x') return (xOffset < 0) ? 'right' : 'left';
            return (yOffset < 0) ? 'down' : 'up';
        })(this.getScene().player);
        this.isAttacking = true;
        this.canAttack = false;
        this.play('skellee_throw');
        this.timerEvents.push(this.scene.time.delayedCall(312, () => {
            this.isAttacking = false;
        }));
        this.timerEvents.push(this.scene.time.delayedCall(1000, () => this.canAttack = true));
    }

    showInjured() {
        if (this.injuredCooldown) {
            let osc = Math.abs(Math.sin(this.scene.time.now / 100));
            this.tint = Phaser.Display.Color.GetColor(155 + 100 * osc, 0, 0);
            this.alpha = 0.6 + 0.3 * osc;
        } else {
            this.clearTint();
            this.alpha = 1;
        }
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
            this.timerEvents.push(this.scene.time.delayedCall(500, () => this.injuredCooldown = false));
        }
        this.getScene().refreshHealthBar();
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
        this.destroy();
    }

    private getBody() {
        return this.body as Phaser.Physics.Arcade.Body
    }
}