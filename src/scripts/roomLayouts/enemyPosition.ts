export default class EnemyPosition {
    public position: Phaser.Math.Vector2;
    public enemyName: string;
    public config: any;

    constructor(position: Phaser.Math.Vector2, enemyName: string, config?: any) {
        this.position = position;
        this.enemyName = enemyName;
        this.config = config;
    }
}