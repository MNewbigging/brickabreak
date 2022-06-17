import Phaser from 'phaser';
import blueboard from '/assets/blueboard.png';
import evilball from '/assets/evilball.png';
import whitebrick from '/assets/whitebrick.png';

import { Vec2 } from '../utils/Vec2';
import { GameEventListener, GameEventType } from '../listeners/GameEventListener';

/**
 * This is the main loading screen for the game. It loads all the game assets
 * up front, enabling the play button when loaded which takes user to game.
 */
export class BootScene extends Phaser.Scene {
  private startBtn: Phaser.GameObjects.Image;

  constructor(private eventListener: GameEventListener) {
    super({ key: 'BootScene' });

    eventListener.on(GameEventType.GAME_START, this.onStart);
  }

  public preload() {
    // Just load assets for the loading screen here
    this.load.image('paddle', blueboard);
  }

  public create() {
    const gameCenter = this.getGameCenter();

    // Create the loading screen
    this.cameras.main.setBackgroundColor('#306082');
    //this.startBtn = this.add.image(gameCenter.x, gameCenter.y, 'paddle');

    // Start the load operation for all game assets here
    this.load.once('complete', this.onLoad);

    this.load.image('ball', evilball);
    this.load.image('brick', whitebrick);

    this.load.start();
  }

  private onLoad = () => {
    this.eventListener.fireEvent({ type: GameEventType.GAME_LOADED });
    // this.startBtn.setInteractive();
    // this.startBtn.once('pointerup', this.onStart);
  };

  private onStart = () => {
    this.scene.start('GameScene');
  };

  private getGameSize(): Vec2 {
    return new Vec2(this.sys.game.scale.gameSize.width, this.sys.game.scale.gameSize.height);
  }

  private getGameCenter(): Vec2 {
    const gameSize = this.getGameSize();

    return new Vec2(gameSize.x / 2, gameSize.y / 2);
  }
}
