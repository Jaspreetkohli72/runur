import Within = Phaser.Math.Within
import State from '../utils/state'

export default class MenuScene extends Phaser.Scene {
  input

  constructor() {
    super({ key: 'MenuScene' })
  }

  preload() {}

  create() {
    this.sound.pauseOnBlur = false
    this.sound.play('titleLoop', {
      loop: true
    })
    this.input = this.input.keyboard.createCursorKeys()
    this.add.image(0, 0, 'menuBackground').setOrigin(0).setDepth(0)
    this.add.image(150, 35, 'logo').setDepth(10)
    this.add.image(137, 97, 'mirror').setDepth(10).scale = 0.9
    let playBtn = this.add.image(30, 90, 'playButton').setDepth(10)
    // let playBtn = this.add.image(35, 140, 'playButton').setDepth(10)
    // let creditsBtn = this.add.image(35, 100 , 'creditsButton').setDepth(10)
    let fullscreenBtn = this.add.image(50, 140, 'fullscreenOffButton').setDepth(10)
    let musicToggle = this.add.image(260, 10, 'musicOff').setDepth(10)
    let exitBtn = this.add.image(250, 140, 'exitButton')
    playBtn.setInteractive({ useHandCursor: true })
    // creditsBtn.setInteractive({ useHandCursor: true });
    fullscreenBtn.setInteractive({ useHandCursor: true })
    musicToggle.setInteractive({ useHandCursor: true })
    exitBtn.setInteractive({ useHandCursor: true })
    playBtn.on('pointerup', () => {
      this.scene.switch('MainScene')
      this.sound.stopByKey('titleLoop')
    })
    // creditsBtn.on('pointerup', () => {
    //   this.scene.switch('CreditsScene');
    // })

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
      close()
    })
  }

  update(): void {
    this.handleInput()
  }

  handleInput() {
    if (this.input && this.input.space.isDown) {
      this.scene.start('MainScene')
    }
  }
}
