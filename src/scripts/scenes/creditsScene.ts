export default class CreditsScene extends Phaser.Scene {
  input

  constructor() {
    super({ key: 'CreditsScene' })
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
    this.add.image(0, 0, 'creditsImage').setOrigin(0).setDepth(0)
    const backBtn = this.add.image(215, 145, 'backButton').setDepth(10)
    backBtn.setInteractive()
    backBtn.on('pointerup', () => {
      this.scene.switch('MenuScene')
      this.sound.stopByKey('titleLoop')
    })
  }

  update(): void {}
}
