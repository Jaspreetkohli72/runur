import Config from "../config";

export default class PreloadScene extends Phaser.Scene {
  public loadingBar: any;
  public loadingText: any;
  public progressBar: any;
  public progressBarFill: any;

  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {

    this.cameras.main.setBackgroundColor('#000000')
    this.loadingBar = this.add.graphics();
    this.loadingText = this.add.text(5, Config.gameHeight - 20, "Loading: ", { fontSize: '16px', color: '#450000' });

    this.load.on('progress', this.updateLoading, this);
    this.load.on('complete', this.loadingComplete);

    this.load.image('menuBackground', 'assets/img/background_image.png')

    this.load.image('phaser-logo', 'assets/img/phaser-logo.png')
    this.load.image('bg', 'assets/img/background_image.png')
    this.load.spritesheet('boi', 'assets/tiles/IssacTileset.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    this.load.spritesheet('assets/img/knight', 'assets/img/knight.png', {
      frameWidth: 25,
      frameHeight: 27
    })

    this.load.spritesheet('assets/img/sword', 'assets/img/sword.png', {
      frameWidth: 49,
      frameHeight: 65
    })

    this.preloadMainMenu()

    this.preloadAudio()

    this.preloadItems()
  }

  preloadMainMenu() {
    this.load.image('logo', 'assets/img/logo.png')
    this.load.image('pauseLogo', 'assets/img/pause_logo.png')
    this.load.image('playButton', 'assets/img/play_button.png')
    this.load.image('pauseButton', 'assets/img/pause_button.png')
    this.load.image('resumeButtonOld', 'assets/img/resume_button.png')
    this.load.image('resumeButton', 'assets/img/resume_button_updated.png')
    this.load.image('fullscreenOnButton', 'assets/img/fullscreen_on_button.png')
    this.load.image('fullscreenOffButton', 'assets/img/fullscreen_off_button.png')
    this.load.image('creditsButton', 'assets/img/credits_button.png')
    this.load.image('exitButton', 'assets/img/quit_button.png')
    this.load.image('backButton', 'assets/img/back_button.png')
    this.load.image('restartButton', 'assets/img/restart_button.png')
    this.load.image('pauseMenuBackground', 'assets/img/pause_background_image.png')
    this.load.image('bg', 'assets/img/background.png')
    this.load.image('musicOn', 'assets/img/music_on_button.png')
    this.load.image('musicOff', 'assets/img/music_off_button.png')
    this.load.image('heartBlank', 'assets/img/items/blank_heart.png')
    this.load.image('heartFilled', 'assets/img/items/filled_heart.png')
    this.load.image('mirror', 'assets/img/decoration.png')
    this.load.image('creditsImage', 'assets/img/credits.png')
    this.load.image('gameOverBackground', 'assets/img/game_over_background_image.png')
    this.load.image('gameOverLogo', 'assets/img/game_over_logo.png')
    this.load.image('scoreLabel', 'assets/img/score_label.png')
  }

  preloadAudio() {
    this.load.audio('forwardLoop', 'assets/sfx/RunnuR_Forward_Loop.mp3')
    this.load.audio('titleLoop', 'assets/sfx/Runnur_Title_Theme.mp3')
    this.load.audio('sword_swing_1', 'assets/sfx/Missed_Swing.mp3')
    this.load.audio('sword_swing_2', 'assets/sfx/Missed_Swing_2.mp3')
    this.load.audio('sword_swing_3', 'assets/sfx/Missed_Swing_3.mp3')
    this.load.audio('sword_strike_1', 'assets/sfx/Sword_Strike_1.mp3')
    this.load.audio('sword_strike_2', 'assets/sfx/Sword_Strike_2.mp3')
    this.load.audio('sword_strike_3', 'assets/sfx/Sword_Strike_3.mp3')
    this.load.audio('knight_walk_0', 'assets/sfx/knight_walk_0.wav')
    this.load.audio('knight_walk_1', 'assets/sfx/knight_walk_1.wav')
    this.load.audio('knight_walk_2', 'assets/sfx/knight_walk_2.wav')
    this.load.audio('knight_walk_3', 'assets/sfx/knight_walk_3.wav')
    this.load.audio('knight_walk_4', 'assets/sfx/knight_walk_4.wav')
    this.load.audio('knight_run_0', 'assets/sfx/knight_run_0.wav')
    this.load.audio('knight_run_1', 'assets/sfx/knight_run_1.wav')
    this.load.audio('knight_run_2', 'assets/sfx/knight_run_2.wav')
    this.load.audio('knight_run_3', 'assets/sfx/knight_run_3.wav')
    this.load.audio('knight_run_4', 'assets/sfx/knight_run_4.wav')
  }

  preloadItems() {
    this.load.spritesheet('item_health', 'assets/img/items/health.png', {
      frameWidth: 21,
      frameHeight: 24
    })
    this.load.spritesheet('item_item_base', 'assets/img/items/item_base.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    for (let i = 1; i <= 3; i++) {
      this.load.spritesheet('item_' + i, 'assets/img/items/item_' + i + '.png', {
        frameWidth: 16,
        frameHeight: 31
      })
    }
  }

  updateLoading(percentage) {
    this.loadingBar.clear();
    this.loadingBar.fillStyle(0x783020, 1);
    this.loadingBar.fillRectShape(new Phaser.Geom.Rectangle(
      0,
      0,
      percentage * Config.gameWidth, Config.gameHeight
    ));

    percentage = percentage * 100;
    this.loadingText.setText("Loading: " + percentage.toFixed() + "%");

  }

  loadingComplete() {
  }

  create() {


    this.anims.create({
      key: 'item_health_idle',
      frames: this.anims.generateFrameNumbers('item_health', { start: 0, end: 0 }),
      repeat: -1,
      frameRate: 8
    })

    for (let i = 1; i <= 3; i++) {
      this.anims.create({
        key: 'item_' + i + '_idle',
        frames: this.anims.generateFrameNumbers('item_' + i, { start: 0, end: 3 }),
        repeat: -1,
        frameRate: 4
      })
    }
    this.scene.start('MenuScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
