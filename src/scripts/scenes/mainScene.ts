/**
 * TODO:
 * death animations
 * skeleton enemy type
 * slime enemy type
 * orc enemy type
 * mage enemy type
 * end game / reverse mode
 * 
 * not vital but nice to do:
 * door closing animation bug from previous room
 * better player position on room change
 * player / enemy z depth (z depth based on y position)
 * indicator for player cooldown?
 * 
 */

import Player from '../objects/player'
import RunurScene from './runurScene'
import { DoorsRepository, Door } from '../objects/door'
import { Orientation } from '../utils/enums'
import Room from '../objects/room'
import { EnemyTypes } from '../objects/enemies/availableEnemies'
import State from '../utils/state'
import RoomState from '../state/roomState'
import LevelsConfig from '../config/levelsConfig'

export default class MainScene extends Phaser.Scene implements RunurScene {
  public player: Player
  public map: Phaser.Tilemaps.Tilemap
  public tilemapKey: string
  public tilesetKey: string
  public doorsRepository: DoorsRepository
  public wallsLayer: Phaser.Tilemaps.TilemapLayer
  public healthBarSprites: Array<any> = []

  constructor() {
    super({ key: 'MainScene' })
  }

  public init() {
    const { width, height } = this.sys.game.canvas
    this.tilemapKey = 'assets/tiles/runur_room'
    this.tilesetKey = 'assets/tiles/IssacTileset'
    this.player = new Player(this, 32, 32)

    this.doorsRepository = new DoorsRepository()
    this.doorsRepository.add('northDoor', new Door(this, width / 2, 2, Orientation.South))
    this.doorsRepository.add('eastDoor', new Door(this, width - 2, height / 2, Orientation.West))
    this.doorsRepository.add('southDoor', new Door(this, width / 2, height - 2, Orientation.North))
    this.doorsRepository.add('westDoor', new Door(this, 2, height / 2, Orientation.East))
  }

  preload() {
    this.load.image(this.tilesetKey)
    this.load.tilemapTiledJSON(this.tilemapKey)

    this.player.preload()
    this.doorsRepository.preload()

    this.load.spritesheet('assets/img/bone', 'assets/img/bone.png', {
      frameWidth: 23,
      frameHeight: 20
    })
    for (const enemyType of EnemyTypes) {
      this.load.spritesheet(enemyType.key, enemyType.key + '.png', {
        frameWidth: enemyType.frameWidth,
        frameHeight: enemyType.frameHeight
      })
    }
  }

  create() {
    this.sound.pauseOnBlur = false
    this.sound.play('forwardLoop', {
      loop: true,
      volume: 0.7
    })
    this.refreshHealthBar()
    this.createPauseMenu()

    if (!State.musicEnabled) {
      this.sound.pauseAll()
    }

    this.map = this.make.tilemap({ key: this.tilemapKey })
    const tileset = this.map.addTilesetImage('IssacTileset', this.tilesetKey)

    this.wallsLayer = this.map.createLayer('Walls', tileset)
    this.wallsLayer.setCollisionBetween(1, 39)

    const groundLayer = this.map.createLayer('Ground', tileset)

    this.player.create()

    this.doorsRepository.create()

    this.physics.add.collider(this.player, this.wallsLayer)
    this.physics.add.collider(this.player, groundLayer)

    this.physics.world.bounds.width = this.map.widthInPixels
    this.physics.world.bounds.height = this.map.heightInPixels

    this.gotoRoom(100, 100, false)
  }

  createPauseMenu() {
    const pauseBg = this.add.image(0, 0, 'bg').setOrigin(0).setDepth(10).setVisible(false)
    const logo = this.add.image(150, 35, 'pauseLogo').setDepth(10).setVisible(false)
    const musicToggle = this.add.image(260, 160, 'musicOff').setDepth(20).setVisible(true)
    const musicTogglePM = this.add.image(20, 12, 'musicOff').setDepth(20).setVisible(false)
    const resumeBtn = this.add.image(40, 90, 'resumeButton').setDepth(10).setVisible(false)
    const fullscreenBtn = this.add.image(55, 140, 'fullscreenOffButton').setDepth(10).setVisible(false)
    const exitBtn = this.add.image(250, 140, 'exitButton').setDepth(10).setVisible(false)

    const pauseBtn = this.add.image(260, 10, 'pauseButton').setDepth(10)
    pauseBtn.scale = 0.5
    pauseBtn.setInteractive()
    exitBtn.setInteractive()
    fullscreenBtn.setInteractive()
    musicToggle.setInteractive()
    resumeBtn.setInteractive()
    resumeBtn.on('pointerup', () => {
      resumeBtn.setVisible(false)
      logo.setVisible(false)
      pauseBg.setVisible(false)
      fullscreenBtn.setVisible(false)
      exitBtn.setVisible(false)
      musicToggle.setVisible(true)
      musicTogglePM.setVisible(false)
      pauseBtn.setVisible(true)
    })
    pauseBtn.on('pointerup', () => {
      if (!pauseBg.visible) {
        musicTogglePM.setVisible(true)
        musicToggle.setVisible(false)
        resumeBtn.setVisible(true)
        logo.setVisible(true)
        pauseBg.setVisible(true)
        fullscreenBtn.setVisible(true)
        exitBtn.setVisible(true)
        pauseBtn.setVisible(false)
      } else {
        musicTogglePM.setVisible(false)
        musicToggle.setVisible(true)
        resumeBtn.setVisible(false)
        logo.setVisible(false)
        pauseBg.setVisible(false)
        fullscreenBtn.setVisible(false)
        exitBtn.setVisible(false)
        pauseBtn.setVisible(true)
      }
    })

    fullscreenBtn.on('pointerup', () => {
      if (this.scale.isFullscreen) {
        fullscreenBtn.setTexture('fullscreenOffButton')
        this.scale.stopFullscreen()
        fullscreenBtn.setDisplayOrigin(55, 20)
      } else {
        fullscreenBtn.setTexture('fullscreenOnButton')
        this.scale.startFullscreen()
        fullscreenBtn.setDisplayOrigin(50, 20)
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
      this.sound.stopAll()
      this.scene.switch('MenuScene')
      location.reload()
    })
  }

  gotoRoom(x: integer, y: integer, fadeOut: boolean = true) {
    this.cameras.main.fadeOut(fadeOut ? 900 : 0, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      let oldRoomCoords = new Phaser.Math.Vector2(RoomState.activeRoom?.x, RoomState.activeRoom?.y)
      RoomState.activeRoom?.leave()
      let room = RoomState.getRoom(x, y)
      if (!room) {
        room = new Room(this, x, y)
        RoomState.rooms.push(room)
      }
      RoomState.gotoRoom(room)
      this.movePlayerIntoNewRoom(oldRoomCoords)
      this.refreshDoors()
      this.cameras.main.fadeIn(750, 0, 0, 0)
    })
  }

  refreshDoors() {
    this.doorsRepository.call('enable')
    if (
      !LevelsConfig.levels[State.currentLevelId].rooms[RoomState.activeRoom.x - 1] ||
      !LevelsConfig.levels[State.currentLevelId].rooms[RoomState.activeRoom.x - 1][RoomState.activeRoom.y]
    ) {
      this.doorsRepository.doors.westDoor.disable()
    }
    if (
      !LevelsConfig.levels[State.currentLevelId].rooms[RoomState.activeRoom.x + 1] ||
      !LevelsConfig.levels[State.currentLevelId].rooms[RoomState.activeRoom.x + 1][RoomState.activeRoom.y]
    ) {
      this.doorsRepository.doors.eastDoor.disable()
    }
    if (
      !LevelsConfig.levels[State.currentLevelId].rooms[RoomState.activeRoom.x] ||
      !LevelsConfig.levels[State.currentLevelId].rooms[RoomState.activeRoom.x][RoomState.activeRoom.y - 1]
    ) {
      this.doorsRepository.doors.northDoor.disable()
    }
    if (
      !LevelsConfig.levels[State.currentLevelId].rooms[RoomState.activeRoom.x] ||
      !LevelsConfig.levels[State.currentLevelId].rooms[RoomState.activeRoom.x][RoomState.activeRoom.y + 1]
    ) {
      this.doorsRepository.doors.southDoor.disable()
    }
  }

  movePlayerIntoNewRoom(oldRoomCoords: Phaser.Math.Vector2) {
    if (oldRoomCoords.y > RoomState.activeRoom.y) {
      // they went through north door
      this.player.x = this.doorsRepository.doors.southDoor.x
      this.player.y = this.doorsRepository.doors.southDoor.y - 30
    } else if (oldRoomCoords.y < RoomState.activeRoom.y) {
      // they went through south door
      this.player.x = this.doorsRepository.doors.northDoor.x
      this.player.y = this.doorsRepository.doors.northDoor.y + 15
    } else if (oldRoomCoords.x < RoomState.activeRoom.x) {
      // they went through east door
      this.player.x = this.doorsRepository.doors.westDoor.x + 25
      this.player.y = this.doorsRepository.doors.westDoor.y
    } else if (oldRoomCoords.x > RoomState.activeRoom.x) {
      // they went through west door
      this.player.x = this.doorsRepository.doors.eastDoor.x - 25
      this.player.y = this.doorsRepository.doors.eastDoor.y - 10
    }
  }

  update() {
    if (this.player) this.player.update()
    RoomState.activeRoom?.update()
    this.doorsUpdate()
  }

  private doorsUpdate() {
    this.doorsRepository.doors.northDoor?.update()
    this.doorsRepository.doors.southDoor?.update()
    this.doorsRepository.doors.eastDoor?.update()
    this.doorsRepository.doors.westDoor?.update()
  }

  createHealthBar() {}

  refreshHealthBar() {
    this.healthBarSprites.forEach(sprite => sprite.destroy())
    this.healthBarSprites = []
    for (let i: integer = 1; i <= this.player.maxHealth; ++i) {
      let texture = this.player.health >= i ? 'heartFilled' : 'heartBlank'
      this.healthBarSprites.push(this.add.image(7 + (i - 1) * 13, 7, texture).setDepth(5))
    }
  }

  public gameOver() {
    this.scene.start('GameoverScene')
    this.sound.stopByKey('forwardLoop')
  }
}
