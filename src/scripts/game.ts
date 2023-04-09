import 'phaser'
import MainScene from './scenes/mainScene'
import MenuScene from './scenes/menuScene'
import PreloadScene from './scenes/preloadScene'
import CreditsScene from "./scenes/creditsScene";
import GameoverScene from './scenes/gameoverScene';

const DEFAULT_WIDTH = 272;
const DEFAULT_HEIGHT = 176;

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  pixelArt: true,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MenuScene, MainScene,CreditsScene, GameoverScene],
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { y: 0 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
