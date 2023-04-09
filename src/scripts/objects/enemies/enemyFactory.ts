import { AvailableEnemies } from './availableEnemies'

export default class EnemyFactory {

    constructor(className: string, scene: any, x: any, y: any, config: any) {
        if (AvailableEnemies[className] === undefined || AvailableEnemies[className] === null) {
            throw new Error(`Class type of \'${className}\' is not in the AvailableEnemies list`);
        }
        return new AvailableEnemies[className](scene, x, y, config);
    }
}