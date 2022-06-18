import Phaser from 'phaser';

import { BootScene } from './scenes/BootScene';
import { GameEventListener } from './listeners/GameEventListener';
import { GameManager } from './GameManager';
import { GameScene } from './scenes/GameScene';

export class GameState {
  public gameManager: GameManager;

  private game: Phaser.Game;
  private mainScene: GameScene;

  constructor(private eventListener: GameEventListener) {
    this.gameManager = new GameManager(eventListener);
    this.mainScene = new GameScene(eventListener, this.gameManager);
  }

  public setup() {
    // Register to game events

    // Create the boot scene here (nothing to track for later)
    const bootScene = new BootScene(this.eventListener);

    // Create the Phaser game object
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        parent: 'game-mount',
        mode: Phaser.Scale.RESIZE,
      },
      transparent: true,
      //backgroundColor: '#323C39',
      scene: [bootScene, this.mainScene],
      physics: {
        default: 'arcade',
      },
      fps: {
        min: 30,
        target: 60,
        smoothStep: true,
      },
    };

    this.game = new Phaser.Game(config);
  }
}
