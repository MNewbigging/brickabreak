import Phaser from 'phaser';

import { BootScene } from './scenes/BootScene';
import { GameEventListener, GameEventType } from './listeners/GameEventListener';
import { GameManager } from './GameManager';
import { GameScene } from './scenes/GameScene';

export class GameState {
  private game: Phaser.Game;
  private mainScene: GameScene;
  private gameManager: GameManager;

  constructor(private eventListener: GameEventListener) {
    this.mainScene = new GameScene(eventListener);
    this.gameManager = new GameManager(eventListener);
  }

  public setup() {
    // Register to game events
    this.eventListener.on(GameEventType.STAGE_END, this.onStageEnd);

    // Create the boot scene here (nothing to track for later)
    const bootScene = new BootScene();

    // Create the Phaser game object
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        parent: 'game-stage',
        mode: Phaser.Scale.RESIZE,
      },
      backgroundColor: '#f2f2f2',
      scene: [bootScene, this.mainScene],
      physics: {
        default: 'arcade',
      },
    };

    this.game = new Phaser.Game(config);
  }

  private onStageEnd = () => {
    // Can start loading the next scene
  };
}
