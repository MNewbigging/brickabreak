import Phaser from 'phaser';

import { BootScene } from './scenes/BootScene';
import { GameEventListener, GameEventType } from './listeners/GameEventListener';
import { GameScene } from './scenes/GameScene';

export class GameState {
  private game: Phaser.Game;
  private scene: GameScene;

  constructor(private eventListener: GameEventListener) {}

  public setup() {
    // Register to game events
    this.eventListener.on(GameEventType.STAGE_END, this.onStageEnd);

    // Create the loading scene
    const bootScene = new BootScene();

    this.scene = new GameScene(this.eventListener);

    // Create the Phaser game object
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        parent: 'game-stage',
        mode: Phaser.Scale.RESIZE,
      },
      backgroundColor: '#f2f2f2',
      scene: [bootScene],
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
