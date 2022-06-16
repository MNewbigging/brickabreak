import Phaser from 'phaser';

import { BootScene } from './scenes/BootScene';
import { GameEventListener, GameEventType } from './listeners/GameEventListener';
import { GameScene } from './scenes/GameScene';

export class GameState {
  private game: Phaser.Game;

  constructor(private eventListener: GameEventListener) {}

  public setup() {
    // Register to game events
    this.eventListener.on(GameEventType.STAGE_END, this.onStageEnd);

    // Create the Phaser game object
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        parent: 'game-stage',
        mode: Phaser.Scale.RESIZE,
      },
      backgroundColor: '#f2f2f2',
      scene: [BootScene, GameScene],
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
