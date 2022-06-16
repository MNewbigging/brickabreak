import Phaser from 'phaser';

export class PGameState {
  private game: Phaser.Game;

  public setup() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        parent: 'game-stage',
        mode: Phaser.Scale.RESIZE,
      },
      backgroundColor: '#ffff00',
      scene: {},
    };

    this.game = new Phaser.Game(config);
  }
}
