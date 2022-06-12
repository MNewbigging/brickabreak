import * as PIXI from 'pixi.js';
import minecraft from '/assets/minecraft.png';

export class GameState {
  private app: PIXI.Application;

  public setup() {
    // Get the game stage
    const gameStage = document.getElementById('game-stage');

    // Create the pixi app; creates the canvas and update loop
    this.app = new PIXI.Application({ resizeTo: gameStage });

    // Add the app's canvas to the dom
    gameStage.appendChild(this.app.view);

    // TESTING
    const sprite = PIXI.Sprite.from(minecraft);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.x = this.app.renderer.width / 2;
    sprite.y = this.app.renderer.height / 2;
    sprite.scale.set(10, 10);
    this.app.stage.addChild(sprite);
  }
}
