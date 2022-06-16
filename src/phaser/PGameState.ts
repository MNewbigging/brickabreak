import Phaser from 'phaser';

import { GameScene } from './GameScene';

export class PGameState {
  private game: Phaser.Game;
  private scene: GameScene;

  public setup() {
    this.scene = new GameScene();

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        parent: 'game-stage',
        mode: Phaser.Scale.RESIZE,
      },
      backgroundColor: '#f2f2f2',
      scene: this.scene,
    };

    this.game = new Phaser.Game(config);
  }
}
