import * as PIXI from 'pixi.js';

import { Ball } from './Ball';

export class GameState {
  private app: PIXI.Application;

  public setup() {
    // Get the game stage
    const gameStage = document.getElementById('game-stage');

    // Create the pixi app; creates the canvas and update loop
    this.app = new PIXI.Application({ resizeTo: gameStage, backgroundColor: 0xffffff });

    // Add the app's canvas to the dom
    gameStage.appendChild(this.app.view);

    // TESTING
    const ball = new Ball(10);
    ball.setPosition(this.app.renderer.width / 2, this.app.renderer.height / 2);
    this.app.stage.addChild(ball.sprite);
  }
}
