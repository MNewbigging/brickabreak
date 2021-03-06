import Phaser from 'phaser';
import ball from '/assets/ball.png';
import blueboard from '/assets/blueboard.png';
import brickAtlas from '/assets/brickAtlas.png';
import brickAtlasJson from '/assets/brickAtlas.json';
import cracksheet from '/assets/cracksheet.png';
import cracksheetJson from '/assets/cracksheet.json';
import explosiveBrick from '/assets/explosive_brick.png';

import { GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { Vec2 } from '../utils/Vec2';

/**
 * This is the main loading screen for the game. It loads all the game assets
 * up front, enabling the play button when loaded which takes user to game.
 */
export class BootScene extends Phaser.Scene {
  constructor(private eventListener: GameEventListener) {
    super({ key: 'BootScene' });

    eventListener.on(GameEventType.GAME_START, this.onStart);
  }

  public preload() {
    // Just load assets for the loading screen here
  }

  public create() {
    // Create the loading screen - empty for now

    // Start the load operation for all game assets here
    this.load.once('complete', this.onLoad);

    this.load.image('paddle', blueboard);
    this.load.image('ball', ball);
    this.load.atlas('bricks', brickAtlas, brickAtlasJson);
    this.load.atlas('cracksheet', cracksheet, cracksheetJson);
    this.load.spritesheet('explosive-brick', explosiveBrick, { frameWidth: 164, frameHeight: 120 });

    this.load.start();
  }

  private onLoad = () => {
    this.eventListener.fireEvent({ type: GameEventType.GAME_LOADED });
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
