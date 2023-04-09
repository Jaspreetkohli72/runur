import State from '../utils/state'

export default class GameoverScene extends Phaser.Scene {
  input

  constructor() {
    super({ key: 'GameoverScene' })
  }

  preload() {
    this.load.image('bg', 'assets/img/background_image.png')
    this.load.audio('titleLoop', 'assets/sfx/Runnur_Title_Theme.mp3')
  }

  create() {
    this.sound.pauseOnBlur = false
    this.sound.play('titleLoop', {
      loop: true
    })
    this.add.image(0, 0, 'gameOverBackground').setOrigin(0).setDepth(0)
    this.add.image(135, 15, 'gameOverLogo').setDepth(10)
    this.add.image(100, 60, 'scoreLabel').setDepth(10)
    const exitBtn = this.add.image(250, 140, 'exitButton').setDepth(10)
    const restartBtn = this.add.image(42.5, 105, 'restartButton').setDepth(10)
    const fullscreenBtn = this.add.image(50, 140, 'fullscreenOffButton').setDepth(10)
    const musicToggle = this.add.image(12.5, 10, 'musicOff').setDepth(10)
    exitBtn.setInteractive()
    restartBtn.setInteractive()
    fullscreenBtn.setInteractive()
    musicToggle.setInteractive()

    restartBtn.on('pointerup', () => {
      window.location.reload();
    })

    fullscreenBtn.on('pointerup', () => {
      if (this.scale.isFullscreen) {
        fullscreenBtn.setTexture('fullscreenOffButton')
        this.scale.stopFullscreen()
        fullscreenBtn.setDisplayOrigin(55, 25)
      } else {
        fullscreenBtn.setTexture('fullscreenOnButton')
        this.scale.startFullscreen()
        fullscreenBtn.setDisplayOrigin(50, 18)
      }
    })

    musicToggle.on('pointerup', () => {
      if (State.musicEnabled) {
        musicToggle.setTexture('musicOn')
        this.sound.pauseAll()
      } else {
        musicToggle.setTexture('musicOff')
        this.sound.resumeAll()
      }
      State.musicEnabled = !State.musicEnabled
    })

    exitBtn.on('pointerup', () => {
      this.scene.switch('MenuScene')
      this.sound.stopByKey('titleLoop')
    })
  }

  update(): void {}
}
